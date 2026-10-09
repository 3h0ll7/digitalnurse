import { useId, type ReactNode } from "react";
import type { Pt } from "./iso";

export type Pose = "stand" | "reach" | "sit" | "walk";

export interface PersonProps {
  /** Screen point under the feet (use project(x, y, 0, origin)). */
  at: Pt;
  pose?: Pose;
  /** Mirror horizontally (face the other way). */
  flip?: boolean;
  scale?: number;
}

const v = (name: string) => `var(--iso-${name})`;

const Figure = ({ at, flip, scale = 0.8, children }: PersonProps & { children: ReactNode }) => (
  <g className="iso-person" transform={`translate(${at[0]},${at[1]}) scale(${flip ? -scale : scale},${scale})`}>
    <ellipse cx={0} cy={0} rx={17} ry={6} fill={v("shadow")} />
    {children}
  </g>
);

const Eyes = ({ y, dx = 3.5 }: { y: number; dx?: number }) => (
  <>
    <circle cx={-dx} cy={y} r={1.15} fill={v("ink")} />
    <circle cx={dx} cy={y} r={1.15} fill={v("ink")} />
  </>
);

/** Arms: "down" hang by the body, "reach" lifts the front arm forward. */
const Arms = ({ color, pose, top = -72 }: { color: string; pose?: Pose; top?: number }) => (
  <>
    <rect x={-20} y={top} width={7} height={28} rx={3.5} fill={color} transform={`rotate(10 -16 ${top})`} />
    {pose === "reach" ? (
      <rect x={13} y={top} width={7} height={26} rx={3.5} fill={color} transform={`rotate(-70 16 ${top})`} />
    ) : (
      <rect x={13} y={top} width={7} height={28} rx={3.5} fill={color} transform={`rotate(-10 16 ${top})`} />
    )}
  </>
);

const Legs = ({ color, pose, shoe }: { color: string; pose?: Pose; shoe: string }) => {
  if (pose === "sit") {
    return (
      <>
        <rect x={-10} y={-40} width={20} height={8} rx={4} fill={color} />
        <rect x={6} y={-40} width={7} height={34} rx={3.5} fill={color} transform="rotate(-8 9 -40)" />
        <ellipse cx={12} cy={-4} rx={6} ry={2.6} fill={shoe} />
      </>
    );
  }
  const spread = pose === "walk" ? 10 : 0;
  return (
    <>
      <rect x={-9} y={-40} width={7} height={38} rx={3.5} fill={color} transform={`rotate(${spread} -5 -40)`} />
      <rect x={2} y={-40} width={7} height={38} rx={3.5} fill={color} transform={`rotate(${-spread} 5 -40)`} />
      <ellipse cx={-6 - spread * 0.6} cy={-1} rx={5} ry={2.5} fill={shoe} />
      <ellipse cx={6 + spread * 0.6} cy={-1} rx={5} ry={2.5} fill={shoe} />
    </>
  );
};

/** Lift the upper body when seated so the hips rest on the seat. */
const seatShift = (pose?: Pose) => (pose === "sit" ? 18 : 0);

/** Nurse: navy hijab, teal scrubs, stethoscope, clipboard. */
export const Nurse = (props: PersonProps) => {
  const dy = seatShift(props.pose);
  return (
    <Figure {...props}>
      <Legs color={v("scrub-d")} pose={props.pose} shoe="#fff" />
      <g transform={`translate(0,${dy})`}>
        <path d="M-14 -68 Q-14 -75 -8 -75 H8 Q14 -75 14 -68 L15 -36 H-15 Z" fill={v("scrub")} />
        <path d="M-6 -75 L0 -66 L6 -75" fill="none" stroke={v("scrub-d")} strokeWidth={1.5} />
        <Arms color={v("scrub")} pose={props.pose} />
        {props.pose !== "reach" && (
          <g transform="rotate(-6 0 -52)">
            <rect x={-10} y={-62} width={17} height={21} rx={2} fill={v("clipboard")} />
            <rect x={-7} y={-58} width={11} height={15} fill="#fff" />
            <path d="M-5 -54 h7 M-5 -50 h5 M-5 -46 h7" stroke={v("ink")} strokeWidth={0.9} opacity={0.5} />
          </g>
        )}
        <path d="M-16 -70 Q-17 -98 0 -100 Q17 -98 16 -70 Q8 -76 0 -76 Q-8 -76 -16 -70 Z" fill={v("hijab")} />
        <ellipse cx={0} cy={-87} rx={7.5} ry={9} fill={v("skin")} />
        <Eyes y={-88} dx={3} />
        <path d="M-2 -82.5 Q0 -81 2 -82.5" fill="none" stroke={v("ink")} strokeWidth={0.9} strokeLinecap="round" />
        <path d="M-7 -73 Q-9 -60 -4 -56 M7 -73 Q9 -62 6 -58" fill="none" stroke="#5B6378" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={6} cy={-57} r={2.2} fill={v("metal")} />
      </g>
    </Figure>
  );
};

/** Doctor or pharmacist: white coat, short hair, beard. */
export const Doctor = (props: PersonProps) => {
  const dy = seatShift(props.pose);
  return (
    <Figure {...props}>
      <Legs color={v("hijab")} pose={props.pose} shoe={v("ink")} />
      <g transform={`translate(0,${dy})`}>
        <path d="M-15 -70 Q-15 -76 -9 -76 H9 Q15 -76 15 -70 L17 -30 H-17 Z" fill={v("coat")} />
        <path d="M-5 -76 L0 -62 L5 -76 Z" fill="#7FA6F2" />
        <path d="M0 -62 V-32" stroke={v("coat-line")} strokeWidth={1.2} />
        <Arms color={v("coat")} pose={props.pose} top={-73} />
        <rect x={5} y={-66} width={7} height={9} rx={1} fill="#fff" stroke={v("coat-line")} strokeWidth={0.8} />
        <rect x={-3.5} y={-82} width={7} height={7} fill={v("skin-d")} />
        <circle cx={0} cy={-90} r={10} fill={v("skin")} />
        <path d="M-10 -91 Q-10 -102 0 -102 Q10 -102 10 -92 Q6 -97 -2 -96 Q-8 -95 -10 -91 Z" fill={v("hair")} />
        <path d="M-9.5 -88 Q-9 -79 0 -79 Q9 -79 9.5 -88 Q6 -84 0 -84 Q-6 -84 -9.5 -88 Z" fill={v("hair")} />
        <Eyes y={-90} />
      </g>
    </Figure>
  );
};

/** Elder: white dishdasha, red-and-white shemagh, black agal, cane. */
export const Elder = (props: PersonProps) => {
  const patternId = useId();
  return (
    <Figure {...props}>
      <defs>
        <pattern id={patternId} width={5} height={5} patternUnits="userSpaceOnUse">
          <rect width={5} height={5} fill="#F4F1F1" />
          <path d="M0 0 h2.5 v2.5 h-2.5z M2.5 2.5 h2.5 v2.5 h-2.5z" fill="#D2423F" />
        </pattern>
      </defs>
      <ellipse cx={-5} cy={-1} rx={5} ry={2.5} fill="#6B4A2E" />
      <ellipse cx={6} cy={-1} rx={5} ry={2.5} fill="#6B4A2E" />
      <path
        d={props.pose === "walk" ? "M-13 -72 Q-13 -78 -7 -78 H7 Q13 -78 13 -72 L20 -3 H-20 Z" : "M-13 -72 Q-13 -78 -7 -78 H7 Q13 -78 13 -72 L17 -3 H-17 Z"}
        fill={v("dishdasha")}
      />
      <path d="M0 -76 V-56" stroke={v("coat-line")} strokeWidth={1.2} />
      <Arms color={v("dishdasha")} top={-74} />
      <path d="M23 -48 L27 0" stroke="#8A5A33" strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={22} cy={-48} r={3.6} fill={v("skin-2")} />
      <circle cx={0} cy={-88} r={9.5} fill={v("skin-2")} />
      <path
        d="M-15 -66 Q-14 -96 0 -100 Q14 -96 15 -66 Q10 -78 9 -86 Q0 -90 -9 -86 Q-10 -78 -15 -66 Z"
        fill={`url(#${patternId})`}
      />
      <ellipse cx={0} cy={-95} rx={11} ry={3.2} fill="none" stroke="#1E2340" strokeWidth={2.6} />
      <Eyes y={-88} dx={3.2} />
      <path d="M-5 -83 Q0 -80 5 -83" fill="none" stroke="#D9D9D9" strokeWidth={2.4} strokeLinecap="round" />
    </Figure>
  );
};

/** Patient in a light-blue hospital gown. */
export const Patient = (props: PersonProps) => {
  const dy = seatShift(props.pose);
  return (
    <Figure {...props}>
      <Legs color={v("skin-2")} pose={props.pose} shoe={v("gown-d")} />
      <g transform={`translate(0,${dy})`}>
        <path d="M-14 -70 Q-14 -76 -8 -76 H8 Q14 -76 14 -70 L16 -34 H-16 Z" fill={v("gown")} />
        <path d="M-10 -60 h20 M-11 -50 h22" stroke={v("gown-d")} strokeWidth={1.2} strokeDasharray="2 3" />
        <Arms color={v("gown")} pose={props.pose} top={-73} />
        <circle cx={0} cy={-88} r={9.5} fill={v("skin-2")} />
        <path d="M-9.5 -90 Q-9 -100 0 -100 Q9 -100 9.5 -90 Q5 -95 0 -95 Q-5 -95 -9.5 -90 Z" fill={v("hair")} />
        <Eyes y={-88} dx={3.2} />
      </g>
    </Figure>
  );
};

/** Child with a pink top and pigtails. */
export const Child = (props: PersonProps) => (
  <Figure {...props} scale={(props.scale ?? 0.8) * 0.72}>
    <Legs color="#2C3A70" pose="stand" shoe="#F48FB1" />
    <path d="M-13 -66 Q-13 -73 -7 -73 H7 Q13 -73 13 -66 L14 -36 H-14 Z" fill="#F48FB1" />
    <Arms color="#F48FB1" pose={props.pose} top={-70} />
    <circle cx={0} cy={-86} r={11} fill={v("skin")} />
    <path d="M-11 -88 Q-10 -99 0 -99 Q10 -99 11 -88 Q4 -94 -11 -88 Z" fill={v("hair")} />
    <circle cx={-12} cy={-90} r={4} fill={v("hair")} />
    <circle cx={12} cy={-90} r={4} fill={v("hair")} />
    <Eyes y={-86} />
    <path d="M-2.5 -81 Q0 -79 2.5 -81" fill="none" stroke={v("ink")} strokeWidth={0.9} strokeLinecap="round" />
  </Figure>
);
