import type { Cell } from "../core";
import { CellState, MineData, MineSweeperCore } from "../core";

export class MineSweeperClassicMode {
  private core: MineSweeperCore;
  private onGameWon: () => void;
  private onGameLost: () => void;
  private mineCount: number = 0;
  private firstClicked = false;

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
  }: {
    size: { row: number; column: number };
    mineCount: number;
  }) => {
    this.core = new MineSweeperCore({
      rowSize: size.row,
      columnSize: size.column,
    });
    this.core.deployMines(mineCount);
    this.mineCount = mineCount;
    this.firstClicked = false;
  };

  private startGame = (cell: Cell) => {
    this.core.validateCell(cell);

    if (this.core.getMineData(cell) === MineData.MINE) {
      this.core.swapMineWithFirstNonMine(cell);
    }
  };

  private isGameWon = () => {
    return (
      this.core.getNonMineOpenedCount() ===
      this.core.getCellCount() - this.mineCount
    );
  };

  private isGameLost = () => {
    return this.core.getMineOpenedCount() >= 1;
  };

  private checkGameEnd = () => {
    if (this.isGameLost()) this.onGameLost();
    else if (this.isGameWon()) this.onGameWon();
  };

  clickCell = (cell: Cell) => {
    if (!this.firstClicked) {
      this.firstClicked = true;
      this.startGame(cell);
    }

    this.core.openCell(cell);
    this.checkGameEnd();
  };

  flagCell = (cell: Cell) => this.core.flagCell(cell);

  clearAdjacentCells = (cell: Cell) => {
    this.core.validateCell(cell);

    if (!(this.core.getMineData(cell) >= 1)) {
      return;
    }

    const flagCount = this.core.for8Neighbors(cell, () => {
      let result = 0;
      return {
        getResult: () => result,
        calculate: (n: Cell) => {
          if (this.core.getState(n) === CellState.FLAGGED) ++result;
        },
      };
    });

    if (flagCount !== this.core.getMineData(cell)) {
      return;
    }

    this.core.clearAdjacentCells(cell);
    this.checkGameEnd();
  };

  getRemainingMineCount = () => this.mineCount - this.core.getFlaggedCount();

  getBoardSize = () => ({
    row: this.core.getRowSize(),
    column: this.core.getColumnSize(),
  });

  getMineData = (cell: Cell) => this.core.getMineData(cell);

  getState = (cell: Cell) => this.core.getState(cell);
}
