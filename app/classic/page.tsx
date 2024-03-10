"use client";

import {
  Board,
  Cell as CellComponent,
  Count,
  DifficultySelector,
  Link,
  Timer,
} from "@/app/_components";
import { Cell, MineSweeperClassicMode } from "@/app/_game";
import { config, disableContextMenu } from "@/app/_react_game";
import { ComponentProps, useCallback, useRef, useState } from "react";

const difficulties = config.classic.boards;
const headlines = config.classic.headlines;

export default function Home() {
  const [_, rerender] = useState(0);
  const [headlineText, setHeadlineText] = useState(headlines.initial);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [timerStart, setTimerStart] = useState(0);

  const game = useRef(
    (function create() {
      const game = new MineSweeperClassicMode({
        onGameWon: () => {
          setHeadlineText(headlines.won);
          setIsEnded(true);
        },
        onGameLost: () => {
          setHeadlineText(headlines.lost);
          setIsEnded(true);
        },
      });

      const initialDifficulty = difficulties[difficultyIndex];
      game.initGame({
        size: { row: initialDifficulty.row, column: initialDifficulty.column },
        mineCount: initialDifficulty.mineCount,
      });

      return game;
    })(),
  );

  const getCellProps = useCallback(
    ({ row, column }: Cell) => {
      function handleUserAction(
        dataset: DOMStringMap,
        method: "clickCell" | "flagCell" | "clearAdjacentCells",
      ) {
        const { row, column } = dataset;
        game.current[method]({
          row: Number(row),
          column: Number(column),
        });

        if (!isStarted) {
          setIsStarted(true);
          setTimerStart(Date.now());
        }
        rerender((r) => ++r);
      }

      const cellProps: ComponentProps<typeof CellComponent> = {
        state: game.current.getCellStates()[row][column],
        data: game.current.getCellMineDatas()[row][column],
        className: isEnded ? "pointer-events-none" : undefined,
        onClick: (e) => {
          handleUserAction(e.currentTarget.dataset, "clickCell");
        },
        onContextMenu: (e) => {
          handleUserAction(e.currentTarget.dataset, "flagCell");
        },
        onDoubleClick: (e) => {
          handleUserAction(e.currentTarget.dataset, "clearAdjacentCells");
        },
        ["data-row"]: row,
        ["data-column"]: column,
      };
      return cellProps;
    },
    [isEnded, isStarted],
  );

  const handleDifficultySelect = useCallback<
    ComponentProps<typeof DifficultySelector>["onDifficultySelect"]
  >((nextIndex) => {
    const nextDifficulty = difficulties[nextIndex];

    game.current.initGame({
      size: { row: nextDifficulty.row, column: nextDifficulty.column },
      mineCount: nextDifficulty.mineCount,
    });

    setHeadlineText(headlines.initial);
    setIsStarted(false);
    setTimerStart(Date.now());
    setIsEnded(false);
    setDifficultyIndex(nextIndex);
  }, []);

  const boardRowSize = game.current.getCellMineDatas().length;
  const boardColumnSize = game.current.getCellMineDatas()[0].length;
  const isTimerRunning = isStarted && !isEnded;

  return (
    <div className="w-full h-full flex justify-center items-center flex-col p-2">
      <div className="w-full flex justify-center items-center flex-row gap-1">
        <Link href="/">⬅️ Home</Link>
        <DifficultySelector
          difficulties={difficulties}
          activeDifficultyIndex={difficultyIndex}
          onDifficultySelect={handleDifficultySelect}
        />
      </div>
      <div className="text-center mt-2">{headlineText}</div>
      <div className="w-full flex justify-center items-center flex-row gap-1 mt-2">
        <Timer
          className="[&&]:text-end"
          startTimestampMs={timerStart}
          isRunning={isTimerRunning}
        />
        <Count
          className="[&&]:text-start"
          prefix="💣"
          count={game.current.getRemainingMineCount()}
        />
      </div>
      <Board
        className="mt-2"
        onContextMenu={disableContextMenu}
        rowSize={boardRowSize}
        columnSize={boardColumnSize}
        CellComponent={CellComponent}
        getCellProps={getCellProps}
      />
    </div>
  );
}
