import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { IsoSvg } from "./primitives";
import { Child, Doctor, Elder, Nurse, Patient } from "./people";

describe("IsoSvg", () => {
  it("forces left-to-right so Arabic labels inside never mirror", () => {
    const html = renderToStaticMarkup(<IsoSvg width={100} height={50} title="غرفة"><g /></IsoSvg>);
    expect(html).toContain("direction:ltr");
    expect(html).toContain('role="img"');
    expect(html).toContain("<title");
  });
  it("hides decorative scenes from assistive tech", () => {
    const html = renderToStaticMarkup(<IsoSvg width={100} height={50} decorative><g /></IsoSvg>);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
  });
  it("exposes interactive maps as a labelled group so rooms stay reachable", () => {
    const html = renderToStaticMarkup(<IsoSvg width={100} height={50} title="Hospital" interactive><g /></IsoSvg>);
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Hospital"');
    expect(html).toContain("direction:ltr");
  });
});

describe("people", () => {
  it("marks every character so the night filter applies", () => {
    for (const Person of [Nurse, Doctor, Elder, Patient, Child]) {
      const html = renderToStaticMarkup(<svg>{<Person at={[10, 20]} />}</svg>);
      expect(html).toContain('class="iso-person"');
      expect(html).toContain("translate(10,20)");
    }
  });
  it("mirrors a flipped character", () => {
    const html = renderToStaticMarkup(<svg><Nurse at={[0, 0]} flip /></svg>);
    expect(html).toContain("scale(-0.8,0.8)");
  });
});
