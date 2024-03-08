"use client";

import {
  Board,
  Cell as CellComponent,
  DifficultySelector,
  Link,
} from "@/app/_components";
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
    <div className="w-full h-full flex justify-center items-center flex-col p-2">
      <div className="w-full flex justify-center items-center flex-row gap-1">
        <Link href="/">Home</Link>
      </div>
      <DifficultySelector
        className="m-2"
        difficulties={config.classic.boards}
        activeDifficultyIndex={difficultyIndex}
        onDifficultySelect={(nextIndex) => {
          initGame({ ...difficulties[nextIndex] });
          setDifficultyIndex(nextIndex);
        }}
      />
      <span className="align-middle m-2">{notification || "..."}</span>
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
