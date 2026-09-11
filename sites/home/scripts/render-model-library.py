"""Render the curated CC0 model collection. Blender is an offline authoring tool."""
import argparse,json,math,sys
from pathlib import Path
import bpy
from mathutils import Vector

parser=argparse.ArgumentParser()
parser.add_argument('--manifest',required=True)
parser.add_argument('--cache',required=True)
parser.add_argument('--output',required=True)
parser.add_argument('--hdri',required=True)
parser.add_argument('--only',default='')
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
manifest=json.loads(Path(args.manifest).read_text())
cache=Path(args.cache);output=Path(args.output);output.mkdir(parents=True,exist_ok=True)

def light(name,location,power,size,color):
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=size;data.color=color
 obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.location=location
 obj.rotation_euler=(-obj.location).to_track_quat('-Z','Y').to_euler()

def render(asset):
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for group in [bpy.data.meshes,bpy.data.materials,bpy.data.images]:
  for item in list(group):
   if item.users==0:group.remove(item)
 folder=cache/asset['sourceId'];record=json.loads((folder/'provenance.json').read_text())
 bpy.ops.import_scene.gltf(filepath=str(folder/record['modelFile']))
 models=[obj for obj in bpy.context.scene.objects if obj.type=='MESH']
 names=asset.get('objects')
 exclude=asset.get('exclude',[])
 selected=[obj for obj in models if (not names or obj.name in names) and not any(word in obj.name for word in exclude)]
 if not selected:raise RuntimeError('No selected geometry for '+asset['key'])
 for obj in models:
  if obj not in selected:obj.hide_render=True
 pivot=bpy.data.objects.new('Exhibit origin',None);bpy.context.collection.objects.link(pivot)
 for obj in selected:
  matrix=obj.matrix_world.copy();obj.parent=pivot;obj.matrix_world=matrix
 bounds=[obj.matrix_world@Vector(corner) for obj in selected for corner in obj.bound_box]
 low=Vector(tuple(min(p[i] for p in bounds) for i in range(3)))
 high=Vector(tuple(max(p[i] for p in bounds) for i in range(3)))
 center=(low+high)/2;scale=3/max(high-low)
 for obj in selected:obj.location-=center
 pivot.scale=(scale,)*3
 pivot.rotation_euler=tuple(math.radians(v) for v in asset.get('rotation',[0,0,0]))
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=True;scene.cycles.max_bounces=8
 scene.render.threads_mode='FIXED';scene.render.threads=8
 scene.render.film_transparent=True;scene.render.resolution_x=scene.render.resolution_y=720;scene.render.resolution_percentage=100
 scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
 scene.view_settings.view_transform='AgX'
 scene.world.use_nodes=True;nodes=scene.world.node_tree;nodes.nodes.clear()
 env=nodes.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(args.hdri)
 background=nodes.nodes.new('ShaderNodeBackground');background.inputs['Strength'].default_value=.65
 world=nodes.nodes.new('ShaderNodeOutputWorld');nodes.links.new(env.outputs['Color'],background.inputs['Color']);nodes.links.new(background.outputs[0],world.inputs[0])
 light('Broad warm key',(-3,-5,6),750,5,(1,.95,.87))
 light('Long cool rim',(4,1,4),1000,4,(.82,.9,1))
 light('Front silk fill',(0,-5,0),180,3,(1,1,1))
 data=bpy.data.cameras.new('Collection camera');camera=bpy.data.objects.new('Collection camera',data);bpy.context.collection.objects.link(camera)
 camera.location=asset.get('camera',[4,-6,3.3]);camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler()
 data.type='ORTHO';scene.camera=camera
 bpy.context.view_layer.update()
 # Frame the final camera-space bounds, so tall books and wide instruments
 # receive the same breathing room without clipping or arbitrary crop factors.
 rotation=camera.rotation_euler.to_matrix()
 projected=[rotation.inverted()@(obj.matrix_world@Vector(corner)) for obj in selected for corner in obj.bound_box]
 x0=min(p.x for p in projected);x1=max(p.x for p in projected)
 y0=min(p.y for p in projected);y1=max(p.y for p in projected)
 camera.location+=rotation@Vector(((x0+x1)/2,(y0+y1)/2,0))
 data.ortho_scale=max(x1-x0,y1-y0)*asset.get('padding',1.18)
 scene.render.filepath=str(output/(asset['key']+'.png'))
 bpy.ops.render.render(write_still=True)
 print('MODEL_RENDERED',asset['key'],len(selected),flush=True)

for asset in manifest['models']:
 if not args.only or asset['key'] in args.only.split(','):render(asset)
