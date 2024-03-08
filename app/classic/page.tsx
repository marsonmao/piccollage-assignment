"use client";

import { Board, Button, Cell as CellComponent, Link } from "@/app/_components";
import { Cell, config, MineSweeperClassicMode } from "@/app/_game";
import {
  ComponentProps,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";

export default function Home() {
  const [notification, setNotification] = useState("");
  const [_, rerender] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [difficultyIndex, setDifficultyIndex] = useState(0);

  const onGameLost = useCallback(() => {
    setNotification("Good game -- restart?");
    setIsEnded(true);
  }, []);

  const onGameWon = useCallback(() => {
    setNotification("You have won! -- restart?");
    setIsEnded(true);
  }, []);

  const difficulties = config.classic.boards;
  const currentDifficulty = difficulties[difficultyIndex];

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

  function initGame({
    row,
    column,
    mineCount,
  }: (typeof config.classic.boards)[number]) {
    game.initGame({
      size: { row, column },
      mineCount,
    });
    setNotification("");
    setIsEnded(false);
  }

  const disableContextMenu: MouseEventHandler = (e) => {
    e.preventDefault();
  };

  const boardRowSize = game.getCellMineDatas().length;
  const boardColumnSize = game.getCellMineDatas()[0].length;

  function getCellProps({ row, column }: Cell) {
    const cellProps: ComponentProps<typeof CellComponent> = {
      state: game.getCellStates()[row][column],
      data: game.getCellMineDatas()[row][column],
      onClick: (e) => {
        if (isEnded) return;

        const { row, column } = e.currentTarget.dataset;
        game.clickCell({
          row: Number(row),
          column: Number(column),
        });
        rerender((r) => ++r);
      },
      onContextMenu: (e) => {
        if (isEnded) return;

        const { row, column } = e.currentTarget.dataset;
        game.flagCell({
          row: Number(row),
          column: Number(column),
        });
        rerender((r) => ++r);
      },
      onDoubleClick: (e) => {
        if (isEnded) return;

        const { row, column } = e.currentTarget.dataset;
        game.clearAdjacentCells({
          row: Number(row),
          column: Number(column),
        });
        rerender((r) => ++r);
      },
    };
    return cellProps;
  }

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="w-full flex justify-center items-center flex-row gap-1">
        <Link href="/">Home</Link>
      </div>
      <div className="w-full flex justify-center items-center flex-row gap-1">
        {difficulties.map((d, index) => {
          const { id, displayName } = d;
          return (
            <Button
              className={
                index === difficultyIndex
                  ? "[&&]:text-gray-50 [&&]:bg-black"
                  : ""
              }
              key={id}
              data-index={index}
              onClick={(e) => {
                const nextDifficultyIndex = Number(
                  e.currentTarget.dataset.index,
                );
                initGame({ ...difficulties[nextDifficultyIndex] });
                setDifficultyIndex(nextDifficultyIndex);
                rerender((r) => ++r);
              }}
            >
              {displayName}
            </Button>
          );
        })}
      </div>
      <span className="h-8 leading-8 align-middle">
        {notification || "..."}
      </span>
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