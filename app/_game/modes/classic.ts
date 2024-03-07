import { MineSweeperCore, CellState } from "../core";
import type { Cell } from "../core";

export class MineSweeperClassicMode {
  private core: MineSweeperCore;
  private onGameWon: () => void;
  private onGameLost: () => void;
  private mineCount: number = 0;

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

  startGame = ({
    cell,
    size,
    mineCount,
  }: {
    cell: Cell;
    size: { row: number; column: number };
    mineCount: number;
  }) => {
    this.core = new MineSweeperCore({
      rowSize: size.row,
      columnSize: size.column,
    });
    this.core.deployMinesFromCell(cell, mineCount);
    this.mineCount = mineCount;
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
    this.core.openCell(cell);
    this.checkGameEnd();
  };

  flagCell = (cell: Cell) => this.core.flagCell(cell);

  clearAdjacentCells = ({ row, column }: Cell) => {
    this.core.validateCell({ row, column });

    const datas = this.core.getCellMineDatas();
    if (!(datas[row][column] >= 1)) {
      return;
    }

    const states = this.core.getCellStates();
    let flagCount = 0;
    for (let r = row - 1; r <= row + 1; ++r) {
      for (let c = column - 1; c <= column + 1; ++c) {
        try {
          this.core.validateCell({ row: r, column: c });
        } catch {
          continue;
        }

        if (states[r][c] === CellState.FLAGGED) {
          ++flagCount;
        }
      }
    }
    if (flagCount === datas[row][column]) {
      this.core.clearAdjacentCells({ row, column });
    }

    this.checkGameEnd();
  };

  getCellStates = () => this.core.getCellStates();

  getCellMineDatas = () => this.core.getCellMineDatas();
}
