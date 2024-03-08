export type Cell = { row: number; column: number };

export namespace MineData {
  export type Mine = -1;
  export type MineCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  export type All = MineCount | Mine;

  export const MINE: Mine = -1;
}

export namespace CellState {
  export type Closed = 10;
  export type Flagged = 20;
  export type Opened = 30;
  export type All = Closed | Flagged | Opened;

  export const CLOSED: CellState.Closed = 10;
  export const FLAGGED: CellState.Flagged = 20;
  export const OPENED: CellState.Opened = 30;
}
export class MineSweeperCore {
  private readonly rowSize: number;
  private readonly columnSize: number;
  private readonly cellCount: number;
  private readonly cellMineDatas: Array<Array<MineData.All>>;
  private readonly cellStates: Array<
    Array<CellState.Closed | CellState.Flagged | CellState.Opened>
  >;

  private nonMineOpenedCount: number = 0;
  private mineOpenedCount: number = 0;

  constructor(props: { rowSize: number; columnSize: number }) {
    this.rowSize = props.rowSize;
    this.columnSize = props.columnSize;
    this.cellCount = this.rowSize * this.columnSize;

    this.cellMineDatas = new Array<Array<MineData.All>>(this.rowSize)
      .fill([])
      .map(() => new Array<MineData.All>(this.columnSize).fill(0));
    this.cellStates = new Array<Array<CellState.All>>(this.rowSize)
      .fill([])
      .map(() =>
        new Array<CellState.All>(this.columnSize).fill(CellState.CLOSED)
      );
  }

  deployMines = (mineCount: number) => {
    if (mineCount < 0 || mineCount > this.cellCount) {
      throw new Error("invalid");
    }

    let value = mineCount;
    while (value > 0) {
      const mineIndex = Math.round(Math.random() * (this.cellCount - 1));
      const rowIndex = Math.floor(mineIndex / this.columnSize);
      const colIndex = mineIndex % this.columnSize;

      if (this.cellMineDatas[rowIndex][colIndex] === MineData.MINE) {
        continue;
      }

      this.cellMineDatas[rowIndex][colIndex] = MineData.MINE;
      --value;
    }

    for (let r = 0; r < this.rowSize; ++r) {
      for (let c = 0; c < this.columnSize; ++c) {
        if (this.cellMineDatas[r][c] === MineData.MINE) continue;

        this.cellMineDatas[r][c] = this.calculateAdjacentCount(
          { row: r, column: c },
          this.cellMineDatas,
          MineData.MINE
        ) as MineData.MineCount;
      }
    }
  };

  swapMineWithFirstNonMine = (mineCell: Cell) => {
    this.validateCell(mineCell);
    if (this.cellMineDatas[mineCell.row][mineCell.column] !== MineData.MINE) {
      throw new Error("invalid");
    }

    const firstNonMine: Cell = { row: -1, column: -1 };
    for (let r = 0; r < this.rowSize; ++r) {
      for (let c = 0; c < this.columnSize; ++c) {
        if (this.cellMineDatas[r][c] !== MineData.MINE) {
          firstNonMine.row = r;
          firstNonMine.column = c;
          break;
        }
      }
    }

    if (firstNonMine.row === -1) {
      return;
    }

    // Set initial data
    {
      this.cellMineDatas[mineCell.row][mineCell.column] = 0;
      this.cellMineDatas[firstNonMine.row][firstNonMine.column] = MineData.MINE;
    }

    // Refresh data
    {
      this.cellMineDatas[mineCell.row][mineCell.column] =
        this.calculateAdjacentCount(
          mineCell,
          this.cellMineDatas,
          MineData.MINE
        ) as MineData.MineCount;

      for (let r = firstNonMine.row - 1; r <= firstNonMine.row + 1; ++r) {
        for (
          let c = firstNonMine.column - 1;
          c <= firstNonMine.column + 1;
          ++c
        ) {
          try {
            this.validateCell({ row: r, column: c });
          } catch {
            continue;
          }

          this.cellMineDatas[r][c] = this.calculateAdjacentCount(
            { row: r, column: c },
            this.cellMineDatas,
            MineData.MINE
          ) as MineData.MineCount;
        }
      }
    }
  };

  openCell = ({ row, column }: Cell) => {
    this.validateCell({ row, column });

    const prev = this.cellStates[row][column];

    if (prev === CellState.OPENED) {
      return;
    } else if (prev === CellState.FLAGGED) {
      return;
    } else if (prev === CellState.CLOSED) {
      if (this.cellMineDatas[row][column] === MineData.MINE) {
        this.cellStates[row][column] = CellState.OPENED;
        ++this.mineOpenedCount;
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

    if (prev === CellState.OPENED) {
      return;
    } else if (prev === CellState.FLAGGED) {
      return;
    } else if (prev === CellState.CLOSED) {
      if (this.cellMineDatas[row][column] === MineData.MINE) {
        return;
      }

      this.cellStates[row][column] = CellState.OPENED;
      ++this.nonMineOpenedCount;

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

    if (prev === CellState.OPENED) {
      result = prev;
    } else if (prev === CellState.FLAGGED) {
      result = CellState.CLOSED;
    } else if (prev === CellState.CLOSED) {
      result = CellState.FLAGGED;
    }

    this.cellStates[row][column] = result;
  };

  clearAdjacentCells = ({ row, column }: Cell) => {
    this.validateCell({ row, column });

    const prev = this.cellStates[row][column];

    if (prev === CellState.OPENED) {
      if (!(this.cellMineDatas[row][column] >= 1)) {
        return;
      }

      const flagCount = this.calculateAdjacentCount(
        { row, column },
        this.cellStates,
        CellState.FLAGGED
      );
      if (flagCount !== this.cellMineDatas[row][column]) {
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
    } else if (prev === CellState.FLAGGED) {
      return;
    } else if (prev === CellState.CLOSED) {
      return;
    }
  };

  getCellMineDatas = () => this.cellMineDatas;

  getCellStates = () => this.cellStates;

  getNonMineOpenedCount = () => this.nonMineOpenedCount;

  getMineOpenedCount = () => this.mineOpenedCount;

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

  private calculateAdjacentCount = (
    cell: Cell,
    data: Array<Array<unknown>>,
    target: unknown
  ): number => {
    let result = 0;

    const { row, column } = cell;
    for (let r = row - 1; r <= row + 1; ++r) {
      for (let c = column - 1; c <= column + 1; ++c) {
        if (r === row && c === column) continue;

        try {
          this.validateCell({ row: r, column: c });
        } catch {
          continue;
        }

        if (data[r][c] === target) ++result;
      }
    }

    return result;
  };
}