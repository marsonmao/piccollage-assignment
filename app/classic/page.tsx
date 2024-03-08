"use client";

import {
  Board,
  Cell as CellComponent,
  DifficultySelector,
  Link,
} from "@/app/_components";
import { Cell, MineSweeperClassicMode } from "@/app/_game";
import { config, disableContextMenu } from "@/app/_react_game";
import { ComponentProps, useCallback, useRef, useState } from "react";

const difficulties = config.classic.boards;

export default function Home() {
  const [_, rerender] = useState(0);
  const [headlineText, setHeadlineText] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const currentDifficulty = difficulties[difficultyIndex];

  const game = useRef(
    (function create() {
      const game = new MineSweeperClassicMode({
        onGameWon: () => {
          setHeadlineText("____YOU HAVE WON____");
          setIsEnded(true);
        },
        onGameLost: () => {
          setHeadlineText("...GOOD GAME...");
          setIsEnded(true);
        },
      });
      game.initGame({
        ...currentDifficulty,
        size: { ...currentDifficulty },
      });
      return game;
    })(),
  );

  const getCellProps = useCallback(
    ({ row, column }: Cell) => {
      const cellProps: ComponentProps<typeof CellComponent> = {
        state: game.current.getCellStates()[row][column],
        data: game.current.getCellMineDatas()[row][column],
        className: isEnded ? "pointer-events-none" : undefined,
        onClick: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.current.clickCell({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
        onContextMenu: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.current.flagCell({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
        onDoubleClick: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.current.clearAdjacentCells({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
      };
      return cellProps;
    },
    [isEnded],
  );

  const handleDifficultySelect = useCallback<
    ComponentProps<typeof DifficultySelector>["onDifficultySelect"]
  >((nextIndex) => {
    const nextDifficulty = difficulties[nextIndex];

    game.current.initGame({
      size: { row: nextDifficulty.row, column: nextDifficulty.column },
      mineCount: nextDifficulty.mineCount,
    });

    setHeadlineText("...");
    setIsEnded(false);
    setDifficultyIndex(nextIndex);
  }, []);

  const boardRowSize = game.current.getCellMineDatas().length;
  const boardColumnSize = game.current.getCellMineDatas()[0].length;

  return (
    <div className="w-full h-full flex justify-center items-center flex-col p-2">
      <div className="w-full flex justify-center items-center flex-row gap-1">
        <Link href="/">Home</Link>
      </div>
      <DifficultySelector
        className="m-2"
        difficulties={config.classic.boards}
        activeDifficultyIndex={difficultyIndex}
        onDifficultySelect={handleDifficultySelect}
      />
      <span className="align-middle m-2">{headlineText}</span>
      <Board
        onContextMenu={disableContextMenu}
        rowSize={boardRowSize}
        columnSize={boardColumnSize}
        CellComponent={CellComponent}
        getCellProps={getCellProps}
      />
    </div>
  );
}
