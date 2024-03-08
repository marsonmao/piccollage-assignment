"use client";

import {
  Board,
  Cell as CellComponent,
  DifficultySelector,
  Link,
} from "@/app/_components";
import { Cell, MineSweeperClassicMode } from "@/app/_game";
import { config, disableContextMenu } from "@/app/_react_game";
import { ComponentProps, useCallback, useState } from "react";

const difficulties = config.classic.boards;

export default function Home() {
  const [notification, setNotification] = useState("");
  const [_, rerender] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const currentDifficulty = difficulties[difficultyIndex];

  const onGameLost = useCallback(() => {
    setNotification("Good game -- restart?");
    setIsEnded(true);
  }, []);

  const onGameWon = useCallback(() => {
    setNotification("You have won! -- restart?");
    setIsEnded(true);
  }, []);

  const [game] = useState(() => {
    const game = new MineSweeperClassicMode({
      onGameWon,
      onGameLost,
    });
    game.initGame({
      ...currentDifficulty,
      size: { ...currentDifficulty },
    });
    return game;
  });

  const initGame = useCallback(
    ({ row, column, mineCount }: (typeof config.classic.boards)[number]) => {
      game.initGame({
        size: { row, column },
        mineCount,
      });
      setNotification("");
      setIsEnded(false);
    },
    [game],
  );

  const getCellProps = useCallback(
    ({ row, column }: Cell) => {
      const cellProps: ComponentProps<typeof CellComponent> = {
        state: game.getCellStates()[row][column],
        data: game.getCellMineDatas()[row][column],
        className: isEnded ? "pointer-events-none" : undefined,
        onClick: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.clickCell({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
        onContextMenu: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.flagCell({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
        onDoubleClick: (e) => {
          const { row, column } = e.currentTarget.dataset;
          game.clearAdjacentCells({
            row: Number(row),
            column: Number(column),
          });
          rerender((r) => ++r);
        },
      };
      return cellProps;
    },
    [game, isEnded],
  );

  const handleDifficultySelect = useCallback<
    ComponentProps<typeof DifficultySelector>["onDifficultySelect"]
  >(
    (nextIndex) => {
      initGame({ ...difficulties[nextIndex] });
      setDifficultyIndex(nextIndex);
    },
    [initGame],
  );

  const boardRowSize = game.getCellMineDatas().length;
  const boardColumnSize = game.getCellMineDatas()[0].length;
  const headlineText = notification || "...";

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
