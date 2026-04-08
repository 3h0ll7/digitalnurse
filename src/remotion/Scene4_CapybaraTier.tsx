import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const Scene4_CapybaraTier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main title entrance
  const titleScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 1.2, stiffness: 100 },
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowSize = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [20, 60]
  );

  // Subtitle
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [45, 65], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background gradient shift
  const bgShift = interpolate(frame, [0, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Particles
  const particles = [];
  for (let i = 0; i < 30; i++) {
    const seed1 = Math.sin(i * 127.1) * 0.5 + 0.5;
    const seed2 = Math.sin(i * 311.7) * 0.5 + 0.5;
    const seed3 = Math.sin(i * 74.3) * 0.5 + 0.5;
    const speed = 0.5 + seed3 * 1.5;

    const x = seed1 * 1920;
    const baseY = seed2 * 1080;
    const y = (baseY - frame * speed * 2) % 1080;
    const adjustedY = y < 0 ? y + 1080 : y;

    const size = 2 + seed3 * 4;
    const particleOpacity = interpolate(frame, [5, 25], [0, 0.3 + seed3 * 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const color = i % 3 === 0 ? "#00D4FF" : i % 3 === 1 ? "#7B2FFF" : "#FF6B35";

    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: adjustedY,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity: particleOpacity,
          boxShadow: `0 0 ${size * 3}px ${color}`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(${135 + bgShift * 30}deg, #0a001a ${10 + bgShift * 10}%, #1a0040 ${40 + bgShift * 10}%, #000d1a ${80 - bgShift * 10}%, #000 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, rgba(123,47,255,0.05) 50%, transparent 70%)",
          opacity: titleOpacity,
          filter: `blur(${30}px)`,
        }}
      />

      {/* Particles */}
      {particles}

      {/* Main title */}
      <h1
        style={{
          fontSize: 110,
          fontWeight: 900,
          fontFamily: "sans-serif",
          color: "#fff",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          textShadow: `0 0 ${glowSize}px rgba(0,212,255,0.7), 0 0 ${glowSize * 2}px rgba(123,47,255,0.4), 0 0 ${glowSize * 3}px rgba(0,212,255,0.2)`,
          letterSpacing: "8px",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        Capybara Tier
      </h1>

      {/* Decorative line under title */}
      <div
        style={{
          width: interpolate(frame, [30, 60], [0, 500], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #00D4FF, #7B2FFF, transparent)",
          marginTop: 20,
          marginBottom: 30,
          opacity: titleOpacity,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          fontSize: 38,
          fontWeight: 500,
          fontFamily: "sans-serif",
          color: "rgba(255,255,255,0.8)",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          letterSpacing: "3px",
          position: "relative",
          zIndex: 1,
        }}
      >
        Above Opus. Above everything.
      </p>

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderTop: "2px solid rgba(0,212,255,0.3)",
          borderLeft: "2px solid rgba(0,212,255,0.3)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderBottom: "2px solid rgba(123,47,255,0.3)",
          borderRight: "2px solid rgba(123,47,255,0.3)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </div>
  );
};
