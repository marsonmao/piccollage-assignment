"use client";

import { MouseEventHandler, useCallback, useState } from "react";
import { CellState, config, MineSweeperClassicMode } from "./_game";

export default function Home() {
  const [notification, setNotification] = useState("");
  const [_, rerender] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const onGameLost = useCallback(() => {
    setNotification("GG lose!");
    setIsEnded(true);
  }, []);

  const onGameWon = useCallback(() => {
    setNotification("Congrat!!");
    setIsEnded(true);
  }, []);

  const easy = config.classic.boards[0];
  const { row, column, mineCount, displayName } = easy;

  const [game] = useState(() => {
    const game = new MineSweeperClassicMode({
      onGameWon,
      onGameLost,
    });
    game.initGame({
      size: { row, column },
      mineCount,
    });
    return game;
  });

  function initGame() {
    game.initGame({
      size: { row, column },
      mineCount,
    });
    rerender((r) => ++r);
    setNotification("");
    setIsEnded(false);
  }

  function getCell(state: number, mineData: number) {
    if (state === CellState.OPENED) {
      return mineData.toString();
    } else if (state === CellState.FLAGGED) {
      return "F";
    } else {
      return "[]";
    }
  }

  const disableContextMenu: MouseEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>{notification || `Playing mode: ${displayName}`}</h1>
      <button onClick={initGame}>New game</button>
      <div onContextMenu={disableContextMenu}>
        {game.getCellStates().map((row, rowIndex) => {
          const rowElement = (
            <div key={rowIndex.toString()}>
              {row.map((cell, columnIndex) => {
                const cellElement = (
                  <button
                    key={columnIndex.toString()}
                    style={{
                      userSelect: "none",
                      width: 24,
                      height: 24,
                    }}
                    data-row={rowIndex}
                    data-column={columnIndex}
                    onClick={(e) => {
                      if (isEnded) return;

                      const { row, column } = e.currentTarget.dataset;
                      game.clickCell({
                        row: Number(row),
                        column: Number(column),
                      });
                      rerender((r) => ++r);
                    }}
                    onContextMenu={(e) => {
                      if (isEnded) return;

                      const { row, column } = e.currentTarget.dataset;
                      game.flagCell({
                        row: Number(row),
                        column: Number(column),
                      });
                      rerender((r) => ++r);
                    }}
                    onDoubleClick={(e) => {
                      if (isEnded) return;

                      const { row, column } = e.currentTarget.dataset;
                      game.clearAdjacentCells({
                        row: Number(row),
                        column: Number(column),
                      });
                      rerender((r) => ++r);
                    }}
                  >
                    {getCell(
                      cell,
                      game.getCellMineDatas()[rowIndex][columnIndex],
                    )}
                  </button>
                );
                return cellElement;
              })}
            </div>
          );
          return rowElement;
        })}
      </div>
    </div>
  );
}
