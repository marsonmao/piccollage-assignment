"use client";

import { useCallback, useEffect, useState } from "react";
import { MineSweeperClassicMode } from "./_manager";

export default function Home() {
  const onGameEnd = useCallback(() => {
    console.log("GG");
  }, []);
  const onGameWin = useCallback(() => {
    console.log("Congrat!!");
  }, []);
  const [game] = useState(
    () =>
      new MineSweeperClassicMode({
        onGameWin,
        onGameEnd,
      })
  );
  const [_, rerender] = useState(0);

  function getCell(state: number, mineData: number) {
    if (state === 30) {
      return mineData.toString();
    } else if (state === 20) {
      return "F";
    } else {
      return "[]";
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          game.startGame({
            cell: { row: 0, column: 0 },
            size: { row: 8, column: 8 },
            mineCount: 6,
          });
          rerender((r) => ++r);
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
