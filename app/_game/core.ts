import { exhaustiveCaseCheck } from "@/app/_utils";

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
  private readonly cellMineDatas: Array<Array<MineData.All>>;
  private readonly cellStates: Array<
    Array<CellState.Closed | CellState.Flagged | CellState.Opened>
  >;

  private nonMineOpenedCount: number = 0;
  private mineOpenedCount: number = 0;
  private flaggedCount: number = 0;

  constructor(props: { rowSize: number; columnSize: number }) {
    this.rowSize = props.rowSize;
    this.columnSize = props.columnSize;

    this.cellMineDatas = new Array<Array<MineData.All>>(this.rowSize)
      .fill([])
      .map(() => new Array<MineData.All>(this.columnSize).fill(0));
    this.cellStates = new Array<Array<CellState.All>>(this.rowSize)
      .fill([])
      .map(() =>
        new Array<CellState.All>(this.columnSize).fill(CellState.CLOSED),
      );
  }

  deployMines = (mineCount: number) => {
    if (mineCount < 0 || mineCount > this.getCellCount()) {
      throw new Error(`invalid mine count ${mineCount}`);
    }

    let value = mineCount;
    while (value > 0) {
      const mineCandidate = this.getRandomCell();

      if (this.getMineData(mineCandidate) !== MineData.MINE) {
        this.setMineData(mineCandidate, MineData.MINE);
        --value;
      }
    }

    for (let r = 0; r < this.rowSize; ++r) {
      for (let c = 0; c < this.columnSize; ++c) {
        const cell = { row: r, column: c };

        if (this.getMineData(cell) === MineData.MINE) {
          continue;
        }

        this.setMineData(
          cell,
          this.for8Neighbors(cell, this.mineCountPredicate),
        );
      }
    }
  };

  swapMineWithFirstNonMine = (mineCell: Cell) => {
    this.validateCell(mineCell);

    if (this.getMineData(mineCell) !== MineData.MINE) {
      throw new Error(`input cell is not a mine`);
    }

    let firstNonMine: Cell | undefined;
    for (let r = 0; r < this.rowSize; ++r) {
      for (let c = 0; c < this.columnSize; ++c) {
        const at = { row: r, column: c };
        if (this.getMineData(at) !== MineData.MINE) {
          firstNonMine = at;
          break;
        }
      }
      if (firstNonMine) break;
    }

    if (!firstNonMine) {
      return;
    }

    this.setMineData(mineCell, 0);
    this.setMineData(firstNonMine, MineData.MINE);

    this.setMineData(
      mineCell,
      this.for8Neighbors(mineCell, this.mineCountPredicate),
    );

    this.for8Neighbors(firstNonMine, () => ({
      getResult: () => undefined,
      calculate: (neighbor: Cell) => {
        if (this.getMineData(neighbor) === MineData.MINE) {
          return;
        }

        this.setMineData(
          neighbor,
          this.for8Neighbors(neighbor, this.mineCountPredicate),
        );
      },
    }));
  };

  openCell = (cell: Cell) => {
    this.validateCell(cell);

    const prev = this.getState(cell);

    switch (prev) {
      case CellState.CLOSED: {
        if (this.getMineData(cell) === MineData.MINE) {
          this.setState(cell, CellState.OPENED);
          ++this.mineOpenedCount;
        } else {
          this.floodOpenFromCell(cell);
        }

        return;
      }
      case CellState.FLAGGED: {
        return;
      }
      case CellState.OPENED: {
        return;
      }
    }

    exhaustiveCaseCheck({ value: prev });
  };

  private floodOpenFromCell = (cell: Cell) => {
    try {
      this.validateCell(cell);
    } catch {
      return;
    }

    const prev = this.getState(cell);

    switch (prev) {
      case CellState.CLOSED: {
        if (this.getMineData(cell) === MineData.MINE) {
          return;
        }

        this.setState(cell, CellState.OPENED);
        ++this.nonMineOpenedCount;

        if (this.getMineData(cell) === 0) {
          for (let r = cell.row - 1; r <= cell.row + 1; ++r) {
            for (let c = cell.column - 1; c <= cell.column + 1; ++c) {
              this.floodOpenFromCell({ row: r, column: c });
            }
          }
        }

        return;
      }
      case CellState.FLAGGED: {
        return;
      }
      case CellState.OPENED: {
        return;
      }
    }

    exhaustiveCaseCheck({ value: prev });
  };

  flagCell = (cell: Cell) => {
    this.validateCell(cell);

    const prev = this.getState(cell);

    switch (prev) {
      case CellState.CLOSED: {
        this.setState(cell, CellState.FLAGGED);
        ++this.flaggedCount;
        return;
      }
      case CellState.FLAGGED: {
        this.setState(cell, CellState.CLOSED);
        --this.flaggedCount;
        return;
      }
      case CellState.OPENED: {
        return;
      }
    }

    exhaustiveCaseCheck({ value: prev });
  };

  clearAdjacentCells = (cell: Cell) => {
    this.validateCell(cell);

    const prev = this.getState(cell);

    switch (prev) {
      case CellState.CLOSED: {
        return;
      }
      case CellState.FLAGGED: {
        return;
      }
      case CellState.OPENED: {
        for (let r = cell.row - 1; r <= cell.row + 1; ++r) {
          for (let c = cell.column - 1; c <= cell.column + 1; ++c) {
            try {
              this.openCell({ row: r, column: c });
            } catch {
              continue;
            }
          }
        }
        return;
      }
    }

    exhaustiveCaseCheck({ value: prev });
  };

  getMineData = (cell: Cell) => {
    this.validateCell(cell);
    return this.cellMineDatas[cell.row][cell.column];
  };

  private setMineData = (cell: Cell, data: MineData.All) => {
    this.validateCell(cell);
    this.cellMineDatas[cell.row][cell.column] = data;
  };

  getState = (cell: Cell) => {
    this.validateCell(cell);
    return this.cellStates[cell.row][cell.column];
  };

  private setState = (cell: Cell, state: CellState.All) => {
    this.validateCell(cell);
    this.cellStates[cell.row][cell.column] = state;
  };

  getNonMineOpenedCount = () => this.nonMineOpenedCount;

  getMineOpenedCount = () => this.mineOpenedCount;

  getFlaggedCount = () => this.flaggedCount;

  getCellCount = () => this.rowSize * this.columnSize;

  getRowSize = () => this.rowSize;

  getColumnSize = () => this.columnSize;

  validateCell = ({ row, column }: Cell) => {
    if (
      row < 0 ||
      row >= this.rowSize ||
      column < 0 ||
      column >= this.columnSize
    ) {
      throw new Error(`invalid cell {${row}, ${column}}`);
    }
  };

  for8Neighbors = <T>(
    cell: Cell,
    predicate: () => {
      getResult: () => T;
      calculate: (_neighbor: Cell) => void;
    },
  ): T => {
    const runner = predicate();
    const { row, column } = cell;

    for (let r = row - 1; r <= row + 1; ++r) {
      for (let c = column - 1; c <= column + 1; ++c) {
        if (r === row && c === column) continue;

        const neighbor = { row: r, column: c };

        try {
          this.validateCell(neighbor);
        } catch {
          continue;
        }

        runner.calculate(neighbor);
      }
    }

    return runner.getResult();
  };

  private mineCountPredicate = () => {
    let result: MineData.MineCount = 0;
    return {
      getResult: () => result,
      calculate: (n: Cell) => {
        if (this.getMineData(n) === MineData.MINE) ++result;
      },
    };
  };

  getRandomCell = () => {
    const index = Math.round(Math.random() * (this.getCellCount() - 1));
    return {
      row: Math.floor(index / this.columnSize),
      column: index % this.columnSize,
    };
  };
}
