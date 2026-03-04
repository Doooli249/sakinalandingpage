import { GlowEffect } from "@/components/ui/glow-effect";

export default function GlowDemoPage() {
  return (
    <div className="relative mx-auto mt-20 h-44 w-64">
      <GlowEffect
        colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
        mode="static"
        blur="medium"
      />
      <div className="relative h-44 w-64 rounded-lg bg-black p-2 text-white">
        <span className="absolute bottom-4 right-4 text-xs">Glow Demo</span>
      </div>
    </div>
  );
}
