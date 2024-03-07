export type Cell = { row: number; column: number };

namespace MineData {
  export type Mine = -1;
  export type MineCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  export type All = MineCount | Mine;
}

namespace CellState {
  export type Closed = 10;
  export type Flagged = 20;
  export type Opened = 30;
  export type All = Closed | Flagged | Opened;
}
export class MineSweeperCore {
  private readonly rowSize: number;
  private readonly columnSize: number;
  private readonly cellCount: number;
  private readonly maxLifeCount: number;
  private lifeCount: number;

  private readonly cellMineDatas: Array<Array<MineData.All>>;
  readonly MINE: MineData.Mine = -1;
  private isMinesDeployed = false;

  private readonly cellStates: Array<
    Array<CellState.Closed | CellState.Flagged | CellState.Opened>
  >;
  readonly CLOSED: CellState.Closed = 10;
  readonly FLAGGED: CellState.Flagged = 20;
  readonly OPENED: CellState.Opened = 30;
  private openedCount: number = 0;

  constructor(props: {
    rowSize: number;
    columnSize: number;
    maxLifeCount: number;
  }) {
    this.rowSize = props.rowSize;
    this.columnSize = props.columnSize;
    this.cellCount = this.rowSize * this.columnSize;
    this.maxLifeCount = props.maxLifeCount;
    this.lifeCount = props.maxLifeCount;

    this.cellMineDatas = new Array<Array<MineData.All>>(this.rowSize)
      .fill([])
      .map(() => new Array<MineData.All>(this.columnSize).fill(0));
    this.cellStates = new Array<Array<CellState.All>>(this.rowSize)
      .fill([])
      .map(() => new Array<CellState.All>(this.columnSize).fill(this.CLOSED));
  }

  deployMinesFromCell = ({ row, column }: Cell, mineCount: number) => {
    this.validateCell({ row, column });
    if (mineCount <= 0 || mineCount >= this.cellCount) {
      throw new Error("invalid");
    }
    if (this.isMinesDeployed) {
      throw new Error("invalid");
    }

    this.isMinesDeployed = true;

    for (let i = 0; i < mineCount; ++i) {
      while (true) {
        const mineIndex = Math.round(Math.random() * (this.cellCount - 1));
        const rowIndex = Math.floor(mineIndex / this.columnSize);
        const colIndex = mineIndex % this.columnSize;

        if (
          (rowIndex === row && colIndex === column) ||
          this.cellMineDatas[rowIndex][colIndex] === this.MINE
        ) {
          continue;
        }

        this.cellMineDatas[rowIndex][colIndex] = this.MINE;
        break;
      }
    }

    for (let r = 0; r < this.rowSize; ++r) {
      for (let c = 0; c < this.columnSize; ++c) {
        if (this.cellMineDatas[r][c] === this.MINE) continue;

        this.cellMineDatas[r][c] = this.calculateAdjacentMineCount({
          row: r,
          column: c,
        });
      }
    }
  };

  openCell = ({ row, column }: Cell) => {
    this.validateCell({ row, column });

    const prev = this.cellStates[row][column];

    if (prev === this.OPENED) {
      return;
    } else if (prev === this.FLAGGED) {
      return;
    } else if (prev === this.CLOSED) {
      if (this.cellMineDatas[row][column] === this.MINE) {
        this.cellStates[row][column] = this.OPENED;
        ++this.openedCount;
        --this.lifeCount;
      } else {
        this.floodOpenFromCell({ row, column });
      }

      return;
    }
  };

  private floodOpenFromCell = ({ row, column }: Cell) => {
    try {
      this.validateCell({ row, column });
    } catch {
      return;
    }

    const prev = this.cellStates[row][column];

    if (prev === this.OPENED) {
      return;
    } else if (prev === this.FLAGGED) {
      return;
    } else if (prev === this.CLOSED) {
      if (this.cellMineDatas[row][column] === this.MINE) {
        return;
      }

      this.cellStates[row][column] = this.OPENED;
      ++this.openedCount;

      if (this.cellMineDatas[row][column] === 0) {
        for (let r = row - 1; r <= row + 1; ++r) {
          for (let c = column - 1; c <= column + 1; ++c) {
            this.floodOpenFromCell({ row: r, column: c });
          }
        }
      }

      return;
    }
  };

  flagCell = ({ row, column }: Cell) => {
    this.validateCell({ row, column });

    const prev = this.cellStates[row][column];
    let result = prev;

    if (prev === this.OPENED) {
      result = prev;
    } else if (prev === this.FLAGGED) {
      result = this.CLOSED;
    } else if (prev === this.CLOSED) {
      result = this.FLAGGED;
    }

    this.cellStates[row][column] = result;
  };

  clearAdjacentCells = ({ row, column }: Cell) => {
    this.validateCell({ row, column });

    const prev = this.cellStates[row][column];

    if (prev === this.OPENED) {
      if (!(this.cellMineDatas[row][column] >= 1)) {
        return;
      }

      for (let r = row - 1; r <= row + 1; ++r) {
        for (let c = column - 1; c <= column + 1; ++c) {
          try {
            this.openCell({ row: r, column: c });
          } catch {
            continue;
          }
        }
      }
      return;
    } else if (prev === this.FLAGGED) {
      return;
    } else if (prev === this.CLOSED) {
      return;
    }
  };

  setMaxLives = (lives: number) => {
    this.lifeCount = lives;
  };

  getMaxLifeCount = () => this.maxLifeCount;

  getLifeCount = () => this.lifeCount;

  getCellMineDatas = () => this.cellMineDatas;

  getCellStates = () => this.cellStates;

  getOpenedCount = () => this.openedCount;

  getCellCount = () => this.cellCount;

  validateCell = ({ row, column }: Cell) => {
    if (
      row < 0 ||
      row >= this.rowSize ||
      column < 0 ||
      column >= this.columnSize
    ) {
      throw new Error("invalid");
    }
  };

  private calculateAdjacentMineCount = ({
    row,
    column,
  }: Cell): MineData.MineCount => {
    let result: MineData.MineCount = 0;

    for (let r = row - 1; r <= row + 1; ++r) {
      for (let c = column - 1; c <= column + 1; ++c) {
        if (r === row && c === column) continue;

        try {
          this.validateCell({ row: r, column: c });
        } catch {
          continue;
        }

        if (this.cellMineDatas[r][c] === this.MINE) ++result;
      }
    }

    return result as MineData.MineCount;
  };
}
