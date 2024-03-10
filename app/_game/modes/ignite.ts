import type { Cell } from "../core";
import { CellState, MineData, MineSweeperCore } from "../core";

export class MineSweeperIgniteMode {
  private core: MineSweeperCore;
  private onGameWon: () => void;
  private onGameLost: () => void;
  private mineCount: number = 0;
  private clickCount: number = 0;
  private revealCount: number = 0;

  constructor({
    onGameWon,
    onGameLost,
  }: {
    onGameWon: () => void;
    onGameLost: () => void;
  }) {
    this.core = new MineSweeperCore({
      rowSize: 1,
      columnSize: 1,
    });
    this.onGameWon = onGameWon;
    this.onGameLost = onGameLost;
  }

  initGame = ({
    size,
    mineCount,
    maxClickCount,
    revealCount,
  }: {
    size: { row: number; column: number };
    mineCount: number;
    maxClickCount?: number;
    revealCount?: number;
  }) => {
    this.core = new MineSweeperCore({
      rowSize: size.row,
      columnSize: size.column,
    });
    this.core.deployMines(mineCount);
    this.mineCount = mineCount;
    this.clickCount = maxClickCount ?? Math.ceil(this.mineCount * 1.1);
    this.revealCount = revealCount ?? Math.ceil(size.row * size.column * 0.1);
  };

  revealCells = () => {
    let value = this.revealCount;

    while (value > 0) {
      const mineIndex = Math.round(
        Math.random() * (this.core.getCellCount() - 1),
      );
      const rowIndex = Math.floor(mineIndex / this.core.getRowSize());
      const colIndex = mineIndex % this.core.getColumnSize();

      if (
        this.core.getCellStates()[rowIndex][colIndex] === CellState.CLOSED &&
        this.core.getCellMineDatas()[rowIndex][colIndex] >= 1
      ) {
        this.clickCell({ row: rowIndex, column: colIndex });
        --value;
        ++this.clickCount;
      }
    }
  };

  private isGameWon = () => {
    return this.getRemainingMineCount() === 0;
  };

  private isGameLost = () => {
    return this.clickCount <= 0;
  };

  private checkGameEnd = () => {
    if (this.isGameLost()) this.onGameLost();
    else if (this.isGameWon()) this.onGameWon();
  };

  clickCell = (cell: Cell) => {
    this.core.openCell(cell);

    if (this.core.getCellMineDatas()[cell.row][cell.column] === MineData.MINE) {
      this.core.for8Neighbors(cell, () => ({
        getResult: () => undefined,
        calculate: (neighbor: Cell) => {
          try {
            this.core.validateCell(neighbor);
          } catch {
            return;
          }

          if (
            !(
              this.core.getCellMineDatas()[neighbor.row][neighbor.column] >=
                1 &&
              this.core.getCellStates()[neighbor.row][neighbor.column] ===
                CellState.OPENED
            )
          ) {
            return;
          }

          const openedMineCount = this.core.for8Neighbors(neighbor, () => {
            let result = 0;
            return {
              getResult: () => result,
              calculate: ({ row, column }: Cell) => {
                if (
                  this.core.getCellStates()[row][column] === CellState.OPENED &&
                  this.core.getCellMineDatas()[row][column] === MineData.MINE
                ) {
                  ++result;
                }
              },
            };
          });

          if (
            openedMineCount !==
            this.core.getCellMineDatas()[neighbor.row][neighbor.column]
          ) {
            return;
          }

          this.core.clearAdjacentCells(neighbor);
        },
      }));
    }

    --this.clickCount;

    this.checkGameEnd();
  };

  getCellStates = () => this.core.getCellStates();

  getCellMineDatas = () => this.core.getCellMineDatas();

  getRemainingMineCount = () => this.mineCount - this.core.getMineOpenedCount();

  getRemainingClickCount = () => this.clickCount;
}
