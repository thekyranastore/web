import { cn } from "@/lib/utils";

const steps = ["Shop details", "Category", "First product"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Step {current} of {steps.length}
      </p>
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index < current ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
