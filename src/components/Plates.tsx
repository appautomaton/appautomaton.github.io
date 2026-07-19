import cloudMachine from '../plates/cloud-machine.webp'
import comedieSection from '../plates/comedie-section.webp'

/** Between the acts: the Encyclopédie's cloud machine — stage rigging
    driven by cogwheels, which is this workshop's whole thesis in one
    plate. Decorative; the caption carries the credit. */
export function IntermissionPlate() {
  return (
    <figure className="aa-interm aa-bloom" style={{ margin: '0 0 4rem' }}>
      <img
        className="aa-plate-img"
        src={cloudMachine}
        alt="Encyclopédie plate of theatrical cloud-machine rigging: a frame of painted clouds driven by cogwheel mechanisms"
        loading="lazy"
        width={1920}
        height={1614}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <figcaption className="aa-plate-cap">
        <span>
          <b>Intermission</b> — Machines de théâtres, pl. XV: the cloud machine
        </span>
        <span>Encyclopédie, 1772</span>
      </figcaption>
    </figure>
  )
}

/** After the last act: the Comédie-Française cut open — stage, machinery
    loft, and auditorium in one section. Full bleed. */
export function ApparatusPlate() {
  return (
    <section className="aa-apparatus aa-bloom" aria-label="Engraving: the Comédie-Française theater in section">
      <img
        className="aa-plate-img"
        src={comedieSection}
        alt="Longitudinal architectural section of the Comédie-Française: stage, machinery loft, and auditorium, 1772"
        loading="lazy"
        width={2000}
        height={1146}
      />
      <span className="aa-apparatus-cap">
        The Comédie-Française in section — stage, loft &amp; machines · 1772
      </span>
    </section>
  )
}
