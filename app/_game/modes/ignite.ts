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
      const index = Math.round(Math.random() * (this.core.getCellCount() - 1));
      const revealingCell = {
        row: Math.floor(index / this.core.getRowSize()),
        column: index % this.core.getColumnSize(),
      };

      if (
        this.core.getState(revealingCell) === CellState.CLOSED &&
        this.core.getMineData(revealingCell) >= 1
      ) {
        this.clickCell(revealingCell);
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

    if (this.core.getMineData(cell) === MineData.MINE) {
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
              this.core.getMineData(neighbor) >= 1 &&
              this.core.getState(neighbor) === CellState.OPENED
            )
          ) {
            return;
          }

          const openedMineCount = this.core.for8Neighbors(neighbor, () => {
            let result = 0;
            return {
              getResult: () => result,
              calculate: (n: Cell) => {
                if (
                  this.core.getState(n) === CellState.OPENED &&
                  this.core.getMineData(n) === MineData.MINE
                ) {
                  ++result;
                }
              },
            };
          });

          if (openedMineCount !== this.core.getMineData(neighbor)) {
            return;
          }

          this.core.clearAdjacentCells(neighbor);
        },
      }));
    }

    --this.clickCount;

    this.checkGameEnd();
  };

  getRemainingMineCount = () => this.mineCount - this.core.getMineOpenedCount();

  getRemainingClickCount = () => this.clickCount;

  getBoardSize = () => ({
    row: this.core.getRowSize(),
    column: this.core.getColumnSize(),
  });

  getMineData = (cell: Cell) => this.core.getMineData(cell);

  getState = (cell: Cell) => this.core.getState(cell);
}
