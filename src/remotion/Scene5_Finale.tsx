import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const Scene5_Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade from previous scene
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Main text
  const mainTextOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainTextY = interpolate(
    spring({
      frame: frame - 10,
      fps,
      config: { damping: 15, mass: 0.8 },
    }),
    [0, 1],
    [30, 0]
  );

  // URL text
  const urlOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out at the very end
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overallOpacity = fadeIn * fadeOut;

  // Subtle pulse on dot
  const dotPulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Very subtle radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 60%)",
        }}
      />

      {/* Main text */}
      <h1
        style={{
          fontSize: 56,
          fontWeight: 700,
          fontFamily: "sans-serif",
          color: "#fff",
          opacity: mainTextOpacity * overallOpacity,
          transform: `translateY(${mainTextY}px)`,
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: 1200,
          letterSpacing: "-1px",
        }}
      >
        The future of AI defense starts now.
      </h1>

      {/* Divider */}
      <div
        style={{
          width: interpolate(frame, [30, 55], [0, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          marginTop: 40,
          marginBottom: 40,
          opacity: overallOpacity,
        }}
      />

      {/* URL */}
      <p
        style={{
          fontSize: 24,
          fontWeight: 400,
          fontFamily: "sans-serif",
          color: "rgba(255,255,255,0.5)",
          opacity: urlOpacity * overallOpacity,
          letterSpacing: "4px",
        }}
      >
        anthropic.com
      </p>

      {/* Small pulsing dot */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#FF6B35",
          opacity: dotPulse * urlOpacity * overallOpacity,
          boxShadow: "0 0 10px #FF6B35",
        }}
      />
    </div>
  );
};
