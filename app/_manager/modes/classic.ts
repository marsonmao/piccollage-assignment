import { MineSweeperCore } from "../core";
import type { Cell } from "../core";

export class MineSweeperClassicMode {
  private core: MineSweeperCore;
  private onGameEnd: () => void;

  constructor({ onGameEnd }: { onGameEnd: () => void }) {
    this.core = new MineSweeperCore({
      rowSize: 1,
      columnSize: 1,
      maxLifeCount: 1,
    });
    this.onGameEnd = onGameEnd;
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
      maxLifeCount: 1,
    });
    this.core.deployMinesFromCell(cell, mineCount);
  };

  isGameEnd = () => {
    return this.core.getLifeCount() <= 0;
  };

  clickCell = (cell: Cell) => {
    this.core.openCell(cell);

    if (this.isGameEnd()) {
      this.onGameEnd();
    }
  };

  flagCell = (cell: Cell) => this.core.flagCell(cell);

  clearAdjacentCells = ({ row, column }: Cell) => {
    this.core.validateCell({ row, column });

    const states = this.core.getCellStates();
    let flagCount = 0;
    for (let r = row - 1; r <= row + 1; ++r) {
      for (let c = column - 1; c <= column + 1; ++c) {
        if (states[r][c] === this.core.FLAGGED) {
          ++flagCount;
        }
      }
    }

    const datas = this.core.getCellMineDatas();
    if (flagCount === datas[row][column]) {
      this.core.clearAdjacentCells({ row, column });
    }

    if (this.isGameEnd()) {
      this.onGameEnd();
    }
  };
}
