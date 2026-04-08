import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { Scene1_GlitchIntro } from "./Scene1_GlitchIntro";
import { Scene2_AnthropicReveal } from "./Scene2_AnthropicReveal";
import { Scene3_Features } from "./Scene3_Features";
import { Scene4_CapybaraTier } from "./Scene4_CapybaraTier";
import { Scene5_Finale } from "./Scene5_Finale";

// 30fps × 20s = 600 frames total
// Scene 1: 0–3s   = frames 0–89   (90 frames)
// Scene 2: 3–7s   = frames 90–209 (120 frames)
// Scene 3: 7–13s  = frames 210–389 (180 frames)
// Scene 4: 13–17s = frames 390–509 (120 frames)
// Scene 5: 17–20s = frames 510–599 (90 frames)

const SCENE_TRANSITION = 8; // frames for crossfade

const CrossfadeIn: React.FC<{ children: React.ReactNode; startFrame: number }> = ({
  children,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + SCENE_TRANSITION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const MythosLaunch: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Scene 1: Glitch Intro (0-3s) */}
      <Sequence from={0} durationInFrames={90 + SCENE_TRANSITION}>
        <AbsoluteFill>
          <Scene1_GlitchIntro />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Anthropic Reveal (3-7s) */}
      <Sequence from={90 - SCENE_TRANSITION} durationInFrames={120 + SCENE_TRANSITION * 2}>
        <CrossfadeIn startFrame={0}>
          <Scene2_AnthropicReveal />
        </CrossfadeIn>
      </Sequence>

      {/* Scene 3: Features (7-13s) */}
      <Sequence from={210 - SCENE_TRANSITION} durationInFrames={180 + SCENE_TRANSITION * 2}>
        <CrossfadeIn startFrame={0}>
          <Scene3_Features />
        </CrossfadeIn>
      </Sequence>

      {/* Scene 4: Capybara Tier (13-17s) */}
      <Sequence from={390 - SCENE_TRANSITION} durationInFrames={120 + SCENE_TRANSITION * 2}>
        <CrossfadeIn startFrame={0}>
          <Scene4_CapybaraTier />
        </CrossfadeIn>
      </Sequence>

      {/* Scene 5: Finale (17-20s) */}
      <Sequence from={510 - SCENE_TRANSITION} durationInFrames={90 + SCENE_TRANSITION}>
        <CrossfadeIn startFrame={0}>
          <Scene5_Finale />
        </CrossfadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
