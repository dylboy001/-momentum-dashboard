"use client";

import { Boxes } from "./background-boxes";

export function AnimatedWavesBg({ light = false }: { light?: boolean }) {
  const bg      = light ? "bg-white"    : "bg-[#080808]";
  const vignette = light
    ? "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(255,255,255,0.80) 80%, white 100%)"
    : "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(8,8,8,0.75) 85%, #080808 100%)";

  return (
    <div className={`absolute inset-0 overflow-hidden ${bg}`}>

      {/* Atmospheric violet / indigo depth blobs */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 10% 90%, rgba(109,40,217,0.14) 0%, transparent 55%), " +
            "radial-gradient(ellipse 60% 45% at 90% 15%, rgba(67,56,202,0.10) 0%, transparent 50%)",
        }}
      />

      {/* Main isometric hover-reactive Boxes grid */}
      <Boxes light={light} />

      {/* Global vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: vignette }}
      />

    </div>
  );
}
