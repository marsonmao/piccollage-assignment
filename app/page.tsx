"use client";

import { useCallback, useEffect, useState } from "react";
import { MineSweeperClassicMode, CellState, MineData, config } from "./_game";

export default function Home() {
  const onGameLost = useCallback(() => {
    setNotification("GG lose!");
  }, []);
  const onGameWon = useCallback(() => {
    setNotification("Congrat!!");
  }, []);
  const [game] = useState(
    () =>
      new MineSweeperClassicMode({
        onGameWon,
        onGameLost,
      })
  );
  const [_, rerender] = useState(0);
  const [notification, setNotification] = useState("");

  function getCell(state: number, mineData: number) {
    if (state === CellState.OPENED) {
      return mineData.toString();
    } else if (state === CellState.FLAGGED) {
      return "F";
    } else {
      return "[]";
    }
  }

  const easy = config.classic.boards[0];
  const { row, column, mineCount, displayName } = easy;

  return (
    <div>
      <h1>{notification || `Playing mode: ${displayName}`}</h1>
      <button
        onClick={() => {
          game.initGame({
            size: { row, column },
            mineCount,
          });
          rerender((r) => ++r);
          setNotification("");
        }}
      >
        start
      </button>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
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
                      const { row, column } = e.currentTarget.dataset;
                      game.clickCell({
                        row: Number(row),
                        column: Number(column),
                      });
                      rerender((r) => ++r);
                    }}
                    onContextMenu={(e) => {
                      const { row, column } = e.currentTarget.dataset;
                      game.flagCell({
                        row: Number(row),
                        column: Number(column),
                      });
                      rerender((r) => ++r);
                    }}
                    onDoubleClick={(e) => {
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
                      game.getCellMineDatas()[rowIndex][columnIndex]
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
