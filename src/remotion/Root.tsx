import React from "react";
import { Composition } from "remotion";
import { MythosLaunch } from "./MythosLaunch";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MythosLaunch"
        component={MythosLaunch}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
