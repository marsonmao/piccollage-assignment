import type { Cell } from "../core";
import { MineData, MineSweeperCore } from "../core";

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

    if (this.core.getCellMineDatas()[cell.row][cell.column] === MineData.MINE) {
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

  clearAdjacentCells = ({ row, column }: Cell) => {
    this.core.clearAdjacentCells({ row, column });
    this.checkGameEnd();
  };

  getCellStates = () => this.core.getCellStates();

  getCellMineDatas = () => this.core.getCellMineDatas();

  getRemainingMineCount = () => this.mineCount - this.core.getFlaggedCount();
}
