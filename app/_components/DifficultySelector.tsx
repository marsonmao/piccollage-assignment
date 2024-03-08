import { Button } from "@/app/_components";
import { config } from "@/app/_react_game";

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
      className={`flex justify-center items-center flex-row gap-1 ${className ?? ""}`}
    >
      {difficulties.map((d, index) => {
        const { id, displayName } = d;
        const isActive = index === activeDifficultyIndex;
        const text = `${isActive ? "🔄️ " : ""}${displayName}`;

        return (
          <Button
            className={isActive ? "[&&]:text-gray-50 [&&]:bg-black" : ""}
            key={id}
            data-index={index}
            onClick={(e) => {
              const nextDifficultyIndex = Number(e.currentTarget.dataset.index);
              onDifficultySelect(nextDifficultyIndex);
            }}
          >
            {text}
          </Button>
        );
      })}
    </div>
  );
}
