"use client";

import {
  Board,
  Cell as CellComponent,
  Count,
  DifficultySelector,
  Link,
  Timer,
} from "@/app/_components";
import { MineSweeperIgniteMode } from "@/app/_game";
import { config, disableContextMenu, useCellProps } from "@/app/_react_game";
import {
  ComponentProps,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const difficulties = config.ignite.boards;
const headlines = config.ignite.headlines;

export default function Home() {
  const [_, rerender] = useState(0);
  const [headlineText, setHeadlineText] = useState(headlines.initial);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [timerStart, setTimerStart] = useState(0);

  const game = useRef(
    (function create() {
      const game = new MineSweeperIgniteMode({
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

  const cellUserActions = useMemo(
    () => ({
      onClick: {
        gameMethod: "clickCell" as const,
        postUserAction: () => {
          if (!isStarted) {
            setIsStarted(true);
            setTimerStart(Date.now());
          }
          rerender((r) => ++r);
        },
      },
    }),
    [isStarted],
  );

  const cellAdditionalProps = useMemo(
    () => ({
      className: isEnded ? "pointer-events-none" : undefined,
    }),
    [isEnded],
  );

  const { getCellProps: getCellProps2 } = useCellProps({
    game: game.current,
    userActions: cellUserActions,
    additionalProps: cellAdditionalProps,
  });

  const handleDifficultySelect = useCallback<
    ComponentProps<typeof DifficultySelector>["onDifficultySelect"]
  >((nextIndex) => {
    const nextDifficulty = difficulties[nextIndex];

    game.current.initGame({
      size: { row: nextDifficulty.row, column: nextDifficulty.column },
      mineCount: nextDifficulty.mineCount,
    });

    game.current.revealCells();

    setHeadlineText(headlines.initial);
    setIsStarted(false);
    setTimerStart(Date.now());
    setIsEnded(false);
    setDifficultyIndex(nextIndex);
  }, []);

  useLayoutEffect(() => {
    game.current.revealCells();
    rerender((r) => ++r);
  }, []);

  const { row: boardRowSize, column: boardColumnSize } =
    game.current.getBoardSize();
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
        <Count
          className="[&&]:text-start"
          prefix="👆"
          count={game.current.getRemainingClickCount()}
        />
      </div>
      <Board
        className="mt-2"
        onContextMenu={disableContextMenu}
        rowSize={boardRowSize}
        columnSize={boardColumnSize}
        CellComponent={CellComponent}
        getCellProps={getCellProps2}
      />
    </div>
  );
}
