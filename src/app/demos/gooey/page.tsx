import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function GooeyDemoPage() {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <GooeyText
        texts={["Design", "Engineering", "Is", "Awesome"]}
        morphTime={1}
        cooldownTime={0.25}
        className="font-bold"
      />
    </div>
  );
}
