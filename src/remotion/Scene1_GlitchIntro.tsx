import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const Scene1_GlitchIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text fade in (frames 20-60)
  const textOpacity = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screen shake
  const shakeIntensity = interpolate(frame, [0, 30, 70, 90], [6, 4, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 1.5) * shakeIntensity;
  const shakeY = Math.cos(frame * 2.1) * shakeIntensity;

  // Glitch offset for RGB split
  const glitchActive = frame % 12 < 3 && frame < 70;
  const glitchOffset = glitchActive ? Math.sin(frame * 7) * 8 : 0;

  // Scanline flicker
  const scanlineOpacity = interpolate(
    Math.sin(frame * 0.8),
    [-1, 1],
    [0.02, 0.08]
  );

  // Horizontal glitch bars
  const glitchBars = [];
  if (frame % 15 < 4 && frame < 75) {
    for (let i = 0; i < 3; i++) {
      const barY = ((frame * 37 + i * 311) % 1080);
      const barHeight = 2 + (frame * (i + 1) * 13) % 6;
      glitchBars.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: barY,
            height: barHeight,
            background: `rgba(${i === 0 ? "255,107,53" : "0,212,255"},0.3)`,
            transform: `translateX(${(Math.sin(frame * 3 + i) * 20)}px)`,
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
          opacity: scanlineOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Glitch bars */}
      {glitchBars}

      {/* Main text with RGB split */}
      <div style={{ position: "relative" }}>
        {/* Red channel offset */}
        <h1
          style={{
            position: "absolute",
            top: 0,
            left: glitchOffset,
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: "rgba(255,0,0,0.5)",
            opacity: glitchActive ? textOpacity * 0.7 : 0,
            whiteSpace: "nowrap",
            letterSpacing: "-1px",
          }}
        >
          Something massive just dropped.
        </h1>

        {/* Blue channel offset */}
        <h1
          style={{
            position: "absolute",
            top: 0,
            left: -glitchOffset,
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: "rgba(0,100,255,0.5)",
            opacity: glitchActive ? textOpacity * 0.7 : 0,
            whiteSpace: "nowrap",
            letterSpacing: "-1px",
          }}
        >
          Something massive just dropped.
        </h1>

        {/* Main text */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "sans-serif",
            color: "#fff",
            opacity: textOpacity,
            whiteSpace: "nowrap",
            letterSpacing: "-1px",
          }}
        >
          Something massive just dropped.
        </h1>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
