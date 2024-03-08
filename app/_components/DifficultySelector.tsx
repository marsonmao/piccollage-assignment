import { Button } from "@/app/_components";
import { config } from "@/app/_game";

export function DifficultySelector<Type extends keyof typeof config>({
  className,
  difficulties,
  activeDifficultyIndex,
  onDifficultySelect,
}: {
  className?: string;
  difficulties: (typeof config)[Type]["boards"];
  activeDifficultyIndex: number;
  onDifficultySelect: (_index: number) => void;
}) {
  return (
    <div
      className={`w-full flex justify-center items-center flex-row gap-1 ${className ?? ""}`}
    >
      {difficulties.map((d, index) => {
        const { id, displayName } = d;
        return (
          <Button
            className={
              index === activeDifficultyIndex
                ? "[&&]:text-gray-50 [&&]:bg-black"
                : ""
            }
            key={id}
            data-index={index}
            onClick={(e) => {
              const nextDifficultyIndex = Number(e.currentTarget.dataset.index);
              onDifficultySelect(nextDifficultyIndex);
            }}
          >
            {displayName}
          </Button>
        );
      })}
    </div>
  );
}
