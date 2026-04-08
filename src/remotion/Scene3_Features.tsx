import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const FEATURES = [
  { emoji: "\u{1F512}", text: "Revolutionary cybersecurity capabilities" },
  { emoji: "\u{1F9E0}", text: "Step change in reasoning & coding" },
  { emoji: "\u{1F310}", text: "Project Glasswing \u2014 securing critical software" },
  { emoji: "\u{1F3E2}", text: "Apple \u00B7 Google \u00B7 Microsoft \u00B7 Nvidia \u00B7 AWS" },
];

const FeatureRow: React.FC<{
  emoji: string;
  text: string;
  index: number;
  frame: number;
  fps: number;
}> = ({ emoji, text, index, frame, fps }) => {
  const delay = index * 28;
  const entryFrame = frame - delay;

  const slideProgress = spring({
    frame: entryFrame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 80 },
  });

  const opacity = interpolate(entryFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(slideProgress, [0, 1], [600, 0]);

  // Glow on the emoji
  const glowOpacity = interpolate(entryFrame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line accent
  const lineWidth = interpolate(entryFrame, [10, 40], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity,
        transform: `translateX(${translateX}px)`,
        marginBottom: 40,
        position: "relative",
      }}
    >
      {/* Left accent line */}
      <div
        style={{
          position: "absolute",
          left: -140,
          top: "50%",
          width: lineWidth,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #FF6B35)",
          transform: "translateY(-50%)",
        }}
      />

      <span
        style={{
          fontSize: 52,
          filter: `drop-shadow(0 0 ${8 * glowOpacity}px rgba(255,107,53,0.6))`,
        }}
      >
        {emoji}
      </span>
      <span
        style={{
          fontSize: 42,
          fontWeight: 700,
          fontFamily: "sans-serif",
          color: "#fff",
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          letterSpacing: "-0.5px",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Scene3_Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 160,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => {
        const x = ((i * 317 + frame * (0.5 + i * 0.2)) % 1920);
        const y = ((i * 251 + frame * (0.3 + i * 0.15)) % 1080);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#FF6B35" : "#00D4FF",
              opacity: 0.4,
              boxShadow: `0 0 8px ${i % 2 === 0 ? "#FF6B35" : "#00D4FF"}`,
            }}
          />
        );
      })}

      {FEATURES.map((feature, i) => (
        <FeatureRow
          key={i}
          emoji={feature.emoji}
          text={feature.text}
          index={i}
          frame={frame}
          fps={fps}
        />
      ))}

      {/* Right side decorative element */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 200,
          height: 200,
          border: "1px solid rgba(255,107,53,0.15)",
          borderRadius: "50%",
          opacity: interpolate(frame, [0, 30], [0, 0.5], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 50,
          top: "50%",
          transform: "translateY(-50%)",
          width: 280,
          height: 280,
          border: "1px solid rgba(0,212,255,0.1)",
          borderRadius: "50%",
          opacity: interpolate(frame, [20, 50], [0, 0.3], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </div>
  );
};
