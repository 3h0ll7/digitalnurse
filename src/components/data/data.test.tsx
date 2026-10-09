import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import BandBar from "./BandBar";
import BarList from "./BarList";
import DistributionBar from "./DistributionBar";
import FilterChips from "./FilterChips";
import RangeLanes from "./RangeLanes";
import StatTile from "./StatTile";
import StepTimeline from "./StepTimeline";
import SourceNote from "./SourceNote";

const bands = [
  { from: 110, to: 120, tone: "critical" as const, label: "Critical low" },
  { from: 120, to: 135, tone: "warn" as const, label: "Low" },
  { from: 135, to: 145, tone: "normal" as const, label: "Normal" },
  { from: 145, to: 160, tone: "critical" as const, label: "High" },
];

describe("BandBar", () => {
  it("places the marker at the value and describes it in words", () => {
    const html = renderToStaticMarkup(<BandBar min={110} max={160} bands={bands} value={135} unit="mmol/L" ariaLabel="Sodium" valueLabel="Normal" />);
    expect(html).toContain("left:50%");
    expect(html).toContain('role="img"');
    expect(html).toMatch(/aria-label="Sodium: 135 mmol\/L — Normal"/);
  });
  it("draws no marker without a value", () => {
    const html = renderToStaticMarkup(<BandBar min={110} max={160} bands={bands} value={null} ariaLabel="Sodium" />);
    expect(html).not.toContain("data-marker");
  });
  it("clamps an off-scale value to the edge and flags it", () => {
    const html = renderToStaticMarkup(<BandBar min={110} max={160} bands={bands} value={190} ariaLabel="Sodium" />);
    expect(html).toContain("left:100%");
    expect(html).toContain("data-offscale");
  });
});

describe("DistributionBar", () => {
  const segments = [
    { key: "a", label: "Life-threatening", count: 7, color: "var(--viz-1)" },
    { key: "b", label: "Urgent", count: 11, color: "var(--viz-2)" },
  ];
  it("sizes segments by share and lists counts in the legend", () => {
    const html = renderToStaticMarkup(<DistributionBar segments={segments} ariaLabel="Severity" />);
    expect(html).toMatch(/width:38\.8\d*%/);
    expect(html).toContain("Life-threatening");
    expect(html).toContain(">11<");
  });
  it("turns legend items into toggle buttons when selectable", () => {
    const html = renderToStaticMarkup(<DistributionBar segments={segments} ariaLabel="Severity" selected="b" onSelect={() => {}} />);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
  });
});

describe("FilterChips", () => {
  it("hides empty options and marks the selected one", () => {
    const html = renderToStaticMarkup(
      <FilterChips
        ariaLabel="Category"
        value="all"
        onChange={() => {}}
        hideEmpty
        options={[{ value: "all", label: "All", count: 32 }, { value: "peds", label: "Pediatric", count: 0 }]}
      />,
    );
    expect(html).not.toContain("Pediatric");
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("32");
  });
});

describe("BarList", () => {
  it("labels every bar with its value and includes a data table for screen readers", () => {
    const html = renderToStaticMarkup(
      <BarList ariaLabel="Routes" rows={[{ key: "iv", label: "IV", value: 59 }, { key: "po", label: "PO", value: 10 }]} />,
    );
    expect(html).toContain("width:100%");
    expect(html).toContain("<table");
    expect(html).toContain(">59<");
  });
});

describe("RangeLanes", () => {
  it("draws each range between its bounds on the shared axis", () => {
    const html = renderToStaticMarkup(
      <RangeLanes ariaLabel="Rates" domain={[0, 200]} ticks={[0, 100, 200]} unit="bpm" rows={[{ key: "sinus", label: "Sinus", min: 60, max: 100 }]} />,
    );
    expect(html).toContain("left:30%");
    expect(html).toContain("width:20%");
  });
});

describe("StatTile, StepTimeline and SourceNote", () => {
  it("render their content", () => {
    expect(renderToStaticMarkup(<StatTile label="High-alert" value={24} />)).toContain("24");
    const steps = renderToStaticMarkup(<StepTimeline steps={[{ title: "Check pH" }, { title: "Find primary disorder" }]} />);
    expect(steps).toContain("<ol");
    expect(steps).toContain("Find primary disorder");
    expect(renderToStaticMarkup(<SourceNote ids={["who-bmi"]} />)).toContain("WHO");
  });
});
