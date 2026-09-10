"""Render original workshop sculptures. Optional authoring tool, never required by CI.

Run Blender with --background --factory-startup --python scripts/render-art.py
-- --output /path/to/render-directory [--only folio,aperture,...].
"""
import argparse
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

args = argparse.ArgumentParser()
args.add_argument('--output', required=True)
args.add_argument('--only', default='folio,aperture,wave,lens,knot,orbit,scene-skills,scene-harnesses,scene-mlx,scene-creative')
options = args.parse_args(sys.argv[sys.argv.index('--') + 1:])
output = Path(options.output)
output.mkdir(parents=True, exist_ok=True)
TAU = math.tau


def material(name, color, metal=0, rough=.3):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Coat Weight'].default_value = .22
    bsdf.inputs['Coat Roughness'].default_value = .2
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 170
    noise.inputs['Detail'].default_value = 2
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = .13
    bump.inputs['Distance'].default_value = .003 if metal else .006
    mat.node_tree.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    mat.node_tree.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return mat


def mesh(name, verts, faces, mat, bevel=0):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    for poly in data.polygons:
        poly.use_smooth = True
    if bevel:
        mod = obj.modifiers.new('Soft manufactured edge', 'BEVEL')
        mod.width, mod.segments = bevel, 3
    return obj


def cube(name, location, scale, mat, bevel=.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Rounded edge', 'BEVEL')
        mod.width, mod.segments = bevel, 5
    return obj


def path(name, points, radius, mat, closed=False):
    data = bpy.data.curves.new(name, 'CURVE')
    data.dimensions, data.resolution_u = '3D', 2
    data.bevel_depth, data.bevel_resolution = radius, 4
    line = data.splines.new('POLY')
    line.points.add(len(points) - 1)
    for p, xyz in zip(line.points, points):
        p.co = (*xyz, 1)
    line.use_cyclic_u = closed
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def sphere(name, center, radius, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=radius, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def cylinder(name, center, radius, depth, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=radius, depth=depth, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    mod = obj.modifiers.new('Machined edge', 'BEVEL')
    mod.width, mod.segments = .025, 3
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def rounded_square(size, corner, y=0):
    points = []
    for sx, sz, start in [(1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)]:
        for j in range(25):
            a = math.radians(start + j * 90 / 24)
            points.append((sx * (size - corner) + corner * math.cos(a), y,
                           sz * (size - corner) + corner * math.sin(a)))
    return points


def sculpture(kind, m):
    ivory, blue, silver, copper, ink = m
    if kind == 'folio':
        for j in range(25):
            u = j / 24
            angle = -.8 + u * 1.65
            verts = []
            for side in [-1, 1]:
                for k in range(65):
                    t = k / 64
                    x = (t - .5) * 2.5
                    z = .85 * math.sin(t * math.pi) + (u - .5) * 1.5
                    y = side * (.84 - .21 * math.sin(t * math.pi))
                    verts.append((x * math.cos(angle) - z * math.sin(angle), y,
                                  x * math.sin(angle) + z * math.cos(angle)))
            obj = mesh('Porcelain folio %02d' % j, verts, [(k, k+1, k+66, k+65) for k in range(64)], ivory)
            solid = obj.modifiers.new('Fine ceramic leaf', 'SOLIDIFY')
            solid.thickness = .016
            bevel = obj.modifiers.new('Polished lip', 'BEVEL')
            bevel.width, bevel.segments = .012, 3
            if j % 4 == 0:
                path('Bronze leaf edge', verts[:65], .009, copper)
    elif kind == 'aperture':
        # The brand's rounded square and central core become a physical object.
        for j in range(9):
            path('Anodized aperture layer', rounded_square(1.24, .47, (j-4)*.073), .092,
                 ivory if j % 4 else silver, True)
        for j in [-1, 1]:
            path('Inlaid blue perimeter', rounded_square(1.25, .47, j*.36), .018, blue, True)
        sphere('Cobalt core', (0, -.04, 0), .48, blue)
        for j in range(5):
            r = .57+j*.035
            path('Orbital hairline', [(r*math.cos(t*TAU/160), .05, r*math.sin(t*TAU/160)) for t in range(160)], .006, copper, True)
    elif kind == 'wave':
        for j in range(43):
            v = (j / 42 - .5)*2.35
            points = []
            for k in range(97):
                t = k / 96
                x = (t-.5)*3.15
                z = .72*math.sin(t*TAU + v*.62)+.17*v
                points.append((x, v, z))
            verts = [(x, y-.023, z+dz) for dz in [-.07,.07] for x,y,z in points]
            obj = mesh('Woven metal lamella', verts, [(k,k+1,k+98,k+97) for k in range(96)], blue if j%8 else copper)
            sol = obj.modifiers.new('Folded edge', 'SOLIDIFY')
            sol.thickness = .018
            path('Silver edge', [(x,y-.025,z+.074) for x,y,z in points], .006, silver)
    elif kind == 'lens':
        for j in range(18):
            r = .46 + j*.052
            y = .22*math.sin(j/17*math.pi)
            path('Concentric optical ring', [(r*math.cos(t*TAU/200),y,r*math.sin(t*TAU/200)) for t in range(200)], .027,
                 blue if j%4 else silver, True)
        sphere('Optical pearl', (0,0,0), .32, copper)
        for a in range(0,360,30):
            angle=math.radians(a)
            path('Radial bridge', [(r*math.cos(angle),.18,r*math.sin(angle)) for r in [.45,1.36]], .008, silver)
    elif kind == 'knot':
        for strand in range(2):
            points=[]
            for i in range(600):
                t=i/600*TAU
                r=1.08+.38*math.cos(3*t)
                points.append((r*math.cos(2*t),r*math.sin(2*t),.52*math.sin(3*t)))
            obj=path('Continuous porcelain knot',points,.17 if strand==0 else .014,ivory if strand==0 else copper,True)
            if strand:
                obj.scale=(1.12,1.12,1.32)
        # Small radial fasteners give the smooth loop a crafted scale.
        for i in range(18):
            t=i/18*TAU
            r=1.08+.38*math.cos(3*t)
            sphere('Flush brass detail',(r*math.cos(2*t),r*math.sin(2*t),.52*math.sin(3*t)+.172),.028,copper)
    elif kind == 'orbit':
        sphere('Engine core',(0,0,0),.59,blue)
        for j in range(11):
            angle=j/11*math.pi
            r=1.05+.13*math.sin(j*1.7)
            points=[]
            for k in range(200):
                t=k/200*TAU
                points.append((r*math.cos(t),r*math.sin(t)*math.sin(angle),r*math.sin(t)*math.cos(angle)))
            path('Gyroscopic brass orbit',points,.012 if j%3 else .023,copper if j%3 else silver,True)
        for i in range(9):
            t=i/9*TAU
            sphere('Orbit bearing',(1.13*math.cos(t),.16,1.13*math.sin(t)),.055,ivory)


def area(name, location, target, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.shape, data.size, data.color = energy, 'DISK', size, color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()


def render(name):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    scene=bpy.context.scene
    scene.render.engine='CYCLES'
    scene.cycles.samples=48
    scene.cycles.use_denoising=True
    scene.cycles.max_bounces=6
    scene.render.threads_mode='FIXED'
    scene.render.threads=8
    scene.render.image_settings.file_format='PNG'
    scene.render.image_settings.color_mode='RGBA'
    scene.render.resolution_percentage=100
    scene.world.color=(.25,.25,.25)
    scene.view_settings.view_transform='AgX'
    m=[material('Warm porcelain',(.76,.73,.65),.15,.27),
       material('Iridescent blue',(.12,.19,.58),.7,.24),
       material('Brushed aluminum',(.66,.71,.75),.92,.26),
       material('Champagne bronze',(.6,.32,.13),.8,.28),
       material('Carbon',(.026,.037,.043),.4,.32)]
    full=name.startswith('scene-')
    kind={'scene-skills':'folio','scene-harnesses':'aperture','scene-mlx':'orbit','scene-creative':'wave'}.get(name,name)
    sculpture(kind,m)
    pieces=list(bpy.context.scene.objects)
    if full:
        # Keep the left half spacious for the editorial overlay.
        for obj in pieces:
            obj.location += Vector((2.3,0,2.85 if name=='scene-harnesses' else 2.3))
            if name=='scene-harnesses':
                obj.scale*=1.2
        stone=material('Warm limestone',(.54,.49,.40),0,.73)
        dark=material('Ink blue plaster',(.038,.06,.08),0,.72)
        sage=material('Sage mineral plaster',(.17,.25,.19),0,.8)
        clay=material('Terracotta limewash',(.48,.27,.15),0,.78)
        floor={'scene-mlx':dark,'scene-harnesses':sage,'scene-creative':clay}.get(name,stone)
        cube('Continuous floor',(0,0,-.18),(200,200,.3),floor)
        cube('Gallery wall',(0,5,4),(30,.35,10),floor)
        if name=='scene-harnesses':
            cube('Monolithic pedestal',(2.3,0,.6),(3.4,2.4,1.2),stone,.025)
            for i in range(19):
                cube('Wall relief',(-4+i*.45,4.72,4),(.11,.22,8),sage,.012)
        elif name=='scene-skills':
            cylinder('Circular plinth',(2.3,0,.52),1.67,1.04,stone)
            for i in range(80):
                a=i/80*TAU
                path('Fluted stone',[(2.3+1.676*math.cos(a),1.676*math.sin(a),z) for z in [.1,.96]],.012,m[0])
        elif name=='scene-mlx':
            cylinder('Instrument pedestal',(2.3,0,.63),1.13,1.26,m[4])
            for i in range(4):
                cube('Distant wall beam',(-4+i*1.5,4.7,4),(.06,.08,8),m[2],.003)
        else:
            cube('Floating low plinth',(2.3,0,.63),(3.9,2.8,1.25),stone,.02)
            for i in range(9):
                cube('Stepped gallery',(6,1+i*.42,i*.13),(5,.44,.15),stone,.015)
        scene.render.film_transparent=False
        scene.render.resolution_x,scene.render.resolution_y=1600,1000
        position,target,scale={
            'scene-skills':((7,-18,5.7),(-.55,0,2.1),12.8),
            'scene-harnesses':((6,-18,4.6),(-.6,0,2.4),12.5),
            'scene-mlx':((5,-14,6.4),(-.65,0,2.2),11.7),
            'scene-creative':((10,-16,9),(-.4,0,2),12.4),
        }[name]
        area('Large skylight',(-3,-2,10),(1,0,1),2200,5,(1,.91,.78))
        area('Window strip',(7,3,7),(2,0,2),1700,4,(.8,.88,1))
        # A hard shaft adds architectural light and long grounded shadows.
        data=bpy.data.lights.new('Late afternoon sun','SUN')
        data.energy,data.angle=1.2,.04
        sun=bpy.data.objects.new('Late afternoon sun',data)
        bpy.context.collection.objects.link(sun)
        sun.rotation_euler=(math.radians(30),math.radians(-25),math.radians(-30))
    else:
        scene.render.film_transparent=True
        scene.render.resolution_x=scene.render.resolution_y=720
        position,target,scale=(5,-8,5),(0,0,0),4.45 if kind in ['folio','wave','knot'] else 3.8
        area('Silkbox key',(-4,-5,7),(0,0,0),950,5,(1,.94,.85))
        area('Cool edge',(4,1,4),(0,0,0),1250,3,(.72,.82,1))
        area('Soft fill',(0,-5,0),(0,0,0),210,3,(1,1,1))
    data=bpy.data.cameras.new('Studio camera')
    camera=bpy.data.objects.new('Studio camera',data)
    bpy.context.collection.objects.link(camera)
    camera.location=position
    camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler()
    data.type='ORTHO'
    data.ortho_scale=scale
    scene.camera=camera
    scene.render.filepath=str(output/(name+'.png'))
    bpy.ops.render.render(write_still=True)
    print('ART_COMPLETE',name,flush=True)


for name in options.only.split(','):
    render(name)
