// Checks WCAG AA (4.5:1) for the redesign's text/background token pairs in both themes.
// Reads the HSL tokens straight from src/index.css so the check follows the real values.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const block = (selector) => {
  const start = css.indexOf(selector);
  return css.slice(start, css.indexOf("}", start));
};
const tokens = (text) =>
  Object.fromEntries([...text.matchAll(/--([\w-]+):\s*(\d+) (\d+)% (\d+)%;/g)].map((m) => [m[1], [+m[2], +m[3], +m[4]]]));

const hslToRgb = ([h, s, l]) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};
const luminance = (rgb) =>
  rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [luminance(hslToRgb(a)), luminance(hslToRgb(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const PAIRS = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["primary-foreground", "primary"],
  ["primary", "card"],
  ["destructive-foreground", "destructive"],
  ["medical-red", "card"],
  ["medical-green", "card"],
  ["medical-yellow", "card"],
  ["medical-blue", "card"],
];

let failed = 0;
for (const [name, selector] of [["day", ":root,"], ["night", ".dark {"]]) {
  const t = tokens(block(selector));
  for (const [fg, bg] of PAIRS) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= 4.5;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"} ${name.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)}`);
  }
}
process.exit(failed ? 1 : 0);
