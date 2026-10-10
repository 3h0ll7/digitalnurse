/**
 * Generates the brand SVGs from code so they stay in sync with the app's glass icons:
 *   public/brand/logo-mark.svg      app icon (DN monogram)
 *   public/favicon.svg              same mark, for the browser tab
 *   public/brand/logo-lockup.svg    mark + bilingual wordmark
 *   docs/brand/hero-{light,dark}.svg  animated README banner
 * Run: npx vite-node scripts/build-brand.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GLASS } from "../src/components/navigation/glass";
import { NAV_KEYS } from "../src/components/navigation/navModel";

const GRAD = ["#6d7dff", "#7c3aed", "#ec4899"];

/** Inner paths of a Lucide icon (24×24 grid). */
const iconPaths = (key: keyof typeof GLASS) =>
  renderToStaticMarkup(createElement(GLASS[key].icon, { size: 24 })).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

// ---------- Logo mark ----------

/** The DN monogram: a rounded D whose spine is an ECG beat that forms the N. 512×512 grid. */
const D_PATH = "M156 144 H240 C322 144 370 200 370 256 C370 312 322 368 240 368 H156 Z";
const BEAT_PATH = "M156 256 H200 L226 192 L256 320 L282 256 H322";

const markDefs = (id: string) => `
  <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GRAD[0]}"/><stop offset=".55" stop-color="${GRAD[1]}"/><stop offset="1" stop-color="${GRAD[2]}"/>
  </linearGradient>
  <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".72"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>`;

const markBody = (id: string) => `
  <rect x="32" y="32" width="448" height="448" rx="132" fill="url(#${id}g)"/>
  <ellipse cx="256" cy="118" rx="176" ry="70" fill="url(#${id}s)"/>
  <rect x="33.5" y="33.5" width="445" height="445" rx="130.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>
  <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
    <path d="${D_PATH}" stroke-width="30"/>
    <path d="${BEAT_PATH}" stroke-width="26"/>
  </g>`;

const logoMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Digital Nurse">
<title>Digital Nurse</title>
<defs>${markDefs("m")}</defs>${markBody("m")}
</svg>
`;

const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 260" role="img" aria-label="Digital Nurse — الممرض الرقمي">
<title>Digital Nurse — الممرض الرقمي</title>
<defs>${markDefs("l")}
  <linearGradient id="lt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GRAD[0]}"/><stop offset=".6" stop-color="${GRAD[1]}"/><stop offset="1" stop-color="${GRAD[2]}"/></linearGradient>
</defs>
<g transform="translate(0 2) scale(0.5)">${markBody("l")}</g>
<text x="290" y="132" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="92" font-weight="800" fill="url(#lt)" letter-spacing="-2">Digital Nurse</text>
<text x="292" y="206" font-family="'Segoe UI','Noto Sans Arabic','Geeza Pro',Tahoma,sans-serif" font-size="50" font-weight="700" fill="#7c3aed" fill-opacity=".85">الممرض الرقمي</text>
</svg>
`;

// ---------- Animated README hero ----------

type Theme = "light" | "dark";
const PALETTE: Record<Theme, { bg0: string; bg1: string; ink: string; muted: string; line: string; blob: string[] }> = {
  light: { bg0: "#f5f3ff", bg1: "#fdf2f8", ink: "#1e1b3a", muted: "#5f5a85", line: "#c7c2f0", blob: ["#a5b4fc", "#f0abfc", "#93c5fd"] },
  dark: { bg0: "#0f1229", bg1: "#1d1440", ink: "#f4f2ff", muted: "#b9b4e3", line: "#3b3670", blob: ["#4338ca", "#a21caf", "#1d4ed8"] },
};

const W = 1200;
const H = 560;
const TILE = 168; // logo tile size in the hero
const TX = W / 2 - TILE / 2;
const TY = 62;
const BASE_Y = TY + TILE / 2; // ECG baseline runs through the middle of the tile

// Left and right ECG strips meeting the tile edges.
const ecgLeft = `M40 ${BASE_Y} H150 L164 ${BASE_Y - 10} L176 ${BASE_Y} H230 L244 ${BASE_Y + 14} L258 ${BASE_Y - 70} L274 ${BASE_Y + 34} L288 ${BASE_Y} H340 Q356 ${BASE_Y - 20} 372 ${BASE_Y} H${TX - 6}`;
const ecgRight = `M${TX + TILE + 6} ${BASE_Y} H${W - 372} Q${W - 356} ${BASE_Y - 20} ${W - 340} ${BASE_Y} H${W - 288} L${W - 274} ${BASE_Y + 34} L${W - 258} ${BASE_Y - 70} L${W - 244} ${BASE_Y + 14} L${W - 230} ${BASE_Y} H${W - 176} L${W - 164} ${BASE_Y - 10} L${W - 150} ${BASE_Y} H${W - 40}`;

const ICON = 50;
const GAP = 14;
const ROW_W = NAV_KEYS.length * ICON + (NAV_KEYS.length - 1) * GAP;
const ROW_X = (W - ROW_W) / 2;
const ROW_Y = 448;

const glassTile = (key: keyof typeof GLASS, i: number) => {
  const { from, to } = GLASS[key];
  const x = ROW_X + i * (ICON + GAP);
  return `
  <g class="pop" style="animation-delay:${(3.0 + i * 0.07).toFixed(2)}s, ${(3.6 + i * 0.07).toFixed(2)}s; transform-origin:${x + ICON / 2}px ${ROW_Y + ICON / 2}px">
    <defs><linearGradient id="i${i}" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
    <rect x="${x}" y="${ROW_Y}" width="${ICON}" height="${ICON}" rx="15" fill="url(#i${i})" filter="url(#tileShadow)" style="color:${to}"/>
    <ellipse cx="${x + ICON / 2}" cy="${ROW_Y + 12}" rx="19" ry="8" fill="url(#sheen)"/>
    <rect x="${x + 0.75}" y="${ROW_Y + 0.75}" width="${ICON - 1.5}" height="${ICON - 1.5}" rx="14.3" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>
    <g transform="translate(${x + 13} ${ROW_Y + 13})" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${iconPaths(key)}</g>
  </g>`;
};

const hero = (theme: Theme) => {
  const p = PALETTE[theme];
  const ar = "'Segoe UI','Noto Sans Arabic','Geeza Pro',Tahoma,sans-serif";
  const en = "'Segoe UI','Helvetica Neue',Arial,sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Digital Nurse — a bilingual clinical reference for bedside nurses">
<title>Digital Nurse — الممرض الرقمي</title>
<defs>
  ${markDefs("h")}
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg0}"/><stop offset="1" stop-color="${p.bg1}"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GRAD[0]}"/><stop offset=".5" stop-color="${GRAD[1]}"/><stop offset="1" stop-color="${GRAD[2]}"/></linearGradient>
  <linearGradient id="title" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GRAD[0]}"/><stop offset=".55" stop-color="${GRAD[1]}"/><stop offset="1" stop-color="${GRAD[2]}"/></linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
  <filter id="neon" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="tileShadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="currentColor" flood-opacity=".45"/></filter>
  <filter id="logoShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="${GRAD[1]}" flood-opacity=".45"/></filter>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<style>
  .draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw var(--d, 1.2s) cubic-bezier(.6,0,.2,1) var(--t, 0s) forwards; }
  @keyframes draw { to { stroke-dashoffset: 0; } }
  .tile { transform-origin: ${W / 2}px ${BASE_Y}px; animation: tileIn .8s cubic-bezier(.2,1.4,.4,1) 1s both, beat 1.6s ease-in-out 3.2s infinite; }
  @keyframes tileIn { from { opacity: 0; transform: scale(.4) rotate(-12deg); } }
  @keyframes beat { 0%,100% { transform: scale(1); } 12% { transform: scale(1.06); } 24% { transform: scale(.98); } 36% { transform: scale(1.03); } }
  .rise { animation: rise .9s cubic-bezier(.2,.9,.3,1) var(--t) both; }
  @keyframes rise { from { opacity: 0; transform: translateY(18px); } }
  .pop { animation: pop .6s cubic-bezier(.2,1.5,.4,1) both, float 3.2s ease-in-out infinite; }
  @keyframes pop { from { opacity: 0; transform: translateY(24px) scale(.3); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .blob { animation: drift 14s ease-in-out infinite alternate; }
  @keyframes drift { to { transform: translate(60px, 30px) scale(1.15); } }
  .spark { animation: spark 2.4s ease-in-out infinite; }
  @keyframes spark { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    *, *::before { animation: none !important; }
    .draw { stroke-dashoffset: 0; }
  }
</style>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle class="blob" cx="180" cy="120" r="170" fill="${p.blob[0]}" opacity=".45" filter="url(#soft)"/>
  <circle class="blob" style="animation-delay:-5s" cx="1040" cy="140" r="180" fill="${p.blob[1]}" opacity=".4" filter="url(#soft)"/>
  <circle class="blob" style="animation-delay:-9s" cx="620" cy="520" r="200" fill="${p.blob[2]}" opacity=".3" filter="url(#soft)"/>

  <!-- faint monitor grid -->
  <g stroke="${p.line}" stroke-opacity=".35" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="40" x2="${W - 40}" y1="${40 + i * 20}" y2="${40 + i * 20}"/>`).join("")}
  </g>

  <!-- the beat travels in from both sides and draws the logo -->
  <g fill="none" stroke="url(#beam)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#neon)">
    <path class="draw" pathLength="1" style="--d:1.1s" d="${ecgLeft}"/>
    <path class="draw" pathLength="1" style="--d:1.1s;--t:1.9s" d="${ecgRight}"/>
  </g>
  <circle r="6" fill="#fff" filter="url(#neon)">
    <animateMotion dur="2.6s" begin="3.2s" repeatCount="indefinite" path="${ecgLeft}"/>
    <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin="3.2s" repeatCount="indefinite"/>
  </circle>

  <g class="tile" filter="url(#logoShadow)">
    <g transform="translate(${TX} ${TY}) scale(${TILE / 512})">
      <rect x="32" y="32" width="448" height="448" rx="132" fill="url(#hg)"/>
      <ellipse cx="256" cy="118" rx="176" ry="70" fill="url(#hs)"/>
      <rect x="33.5" y="33.5" width="445" height="445" rx="130.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>
      <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
        <path class="draw" pathLength="1" style="--d:.9s;--t:1.4s" d="${D_PATH}" stroke-width="30"/>
        <path class="draw" pathLength="1" style="--d:.7s;--t:1.9s" d="${BEAT_PATH}" stroke-width="26"/>
      </g>
    </g>
  </g>

  <text class="rise" style="--t:2.3s" x="${W / 2}" y="318" text-anchor="middle" font-family="${en}" font-size="68" font-weight="800" letter-spacing="-1.5" fill="url(#title)">Digital Nurse</text>
  <text class="rise" style="--t:2.55s" x="${W / 2}" y="368" text-anchor="middle" font-family="${ar}" font-size="36" font-weight="700" fill="${p.ink}">الممرض الرقمي</text>
  <text class="rise" style="--t:2.8s" x="${W / 2}" y="408" text-anchor="middle" font-family="${en}" font-size="19" fill="${p.muted}">Drugs · Labs · ECG · Fluids · Scores · Procedures · AI — for the bedside, in English &amp; Arabic</text>

  ${NAV_KEYS.map((k, i) => glassTile(k, i)).join("")}

  ${[[90, 70], [1110, 90], [70, 470], [1130, 480], [300, 60], [900, 60]]
    .map(([x, y], i) => `<path class="spark" style="animation-delay:${i * 0.4}s" d="M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2}Z" fill="${GRAD[i % 3]}"/>`)
    .join("")}
</g>
</svg>
`;
};

mkdirSync("public/brand", { recursive: true });
mkdirSync("docs/brand", { recursive: true });
writeFileSync("public/brand/logo-mark.svg", logoMark);
writeFileSync("public/favicon.svg", logoMark);
writeFileSync("public/brand/logo-lockup.svg", lockup);
writeFileSync("docs/brand/hero-light.svg", hero("light"));
writeFileSync("docs/brand/hero-dark.svg", hero("dark"));
console.log("brand assets written");
