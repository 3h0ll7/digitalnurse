import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const Scene2_AnthropicReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "A" logo scale-in
  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title text
  const titleProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const titleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  // Subtitle
  const subtitleOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [55, 75], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow on title
  const glowPulse = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [15, 35]
  );

  // Radial gradient animation
  const gradientSize = interpolate(frame, [0, 60], [20, 70], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(ellipse at center, #FF6B35 ${gradientSize * 0.3}%, #331500 ${gradientSize}%, #000 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated ring behind logo */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "2px solid rgba(255,107,53,0.3)",
          transform: `scale(${logoScale * 1.5})`,
          opacity: logoOpacity * 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(255,107,53,0.15)",
          transform: `scale(${logoScale * 1.3})`,
          opacity: logoOpacity * 0.3,
        }}
      />

      {/* Anthropic "A" logo */}
      <div
        style={{
          fontSize: 140,
          fontWeight: 900,
          fontFamily: "sans-serif",
          color: "#FF6B35",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          textShadow: `0 0 ${glowPulse}px rgba(255,107,53,0.6)`,
          marginBottom: 30,
          lineHeight: 1,
        }}
      >
        A
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "sans-serif",
          color: "#fff",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textShadow: `0 0 ${glowPulse}px rgba(255,107,53,0.5), 0 0 ${glowPulse * 2}px rgba(255,107,53,0.2)`,
          letterSpacing: "-2px",
          marginBottom: 16,
        }}
      >
        Introducing Claude Mythos
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 36,
          fontWeight: 500,
          fontFamily: "sans-serif",
          color: "rgba(255,255,255,0.75)",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          letterSpacing: "2px",
        }}
      >
        A new tier beyond Opus.
      </p>

      {/* Bottom line accent */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: interpolate(frame, [40, 80], [0, 400], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #FF6B35, transparent)",
        }}
      />
    </div>
  );
};
