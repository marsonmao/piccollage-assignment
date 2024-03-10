"use client";

import {
  Board,
  Cell as CellComponent,
  Count,
  DifficultySelector,
  Link,
  Timer,
} from "@/app/_components";
import { Cell, CellState, MineData, MineSweeperClassicMode } from "@/app/_game";
import {
  boardCelebrationClasses,
  config,
  disableContextMenu,
  useCellProps,
} from "@/app/_react_game";
import { ComponentProps, useCallback, useMemo, useRef, useState } from "react";

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

  const cellUserActions = useMemo(() => {
    const postUserAction = () => {
      if (!isStarted) {
        setIsStarted(true);
        setTimerStart(Date.now());
      }
      rerender((r) => ++r);
    };

    return {
      onClick: {
        gameMethod: "clickCell" as const,
        postUserAction,
      },
      onContextMenu: {
        gameMethod: "flagCell" as const,
        postUserAction,
      },
      onDoubleClick: {
        gameMethod: "clearAdjacentCells" as const,
        postUserAction,
      },
    };
  }, [isStarted]);

  const getAdditionalProps = useCallback(
    (cell: Cell) => {
      const isLost = headlineText === headlines.lost;
      const isWon = isEnded && !isLost;
      const isBombAndIsLost =
        game.current.getState(cell) === CellState.OPENED &&
        game.current.getMineData(cell) === MineData.MINE &&
        isLost;
      return {
        className: `${isEnded ? "pointer-events-none" : undefined} ${isWon ? "bg-transparent" : ""} ${isLost ? "bg-red-200" : ""}`,
        ...(isBombAndIsLost
          ? {
              textClass: "animate-ping",
            }
          : {}),
      };
    },
    [isEnded, headlineText],
  );

  const { getCellProps } = useCellProps({
    game: game.current,
    userActions: cellUserActions,
    getAdditionalProps,
  });

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

  const { row: boardRowSize, column: boardColumnSize } =
    game.current.getBoardSize();
  const isTimerRunning = isStarted && !isEnded;
  const boardCelebration = `${headlineText === headlines.won ? boardCelebrationClasses : ""}`;

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
        className={`mt-2 ${boardCelebration}`}
        onContextMenu={disableContextMenu}
        rowSize={boardRowSize}
        columnSize={boardColumnSize}
        CellComponent={CellComponent}
        getCellProps={getCellProps}
      />
    </div>
  );
}
