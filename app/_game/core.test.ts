import { MineData, MineSweeperCore } from "./core";

describe("Core functions behavior", () => {
  const rowSize = 16;
  const columnSize = 24;

  describe("Construction behavior", () => {
    test("it should be created without issues with valid props", () => {
      expect(() => {
        new MineSweeperCore({ rowSize: 1, columnSize: 1 });
      }).not.toThrow();

      expect(() => {
        new MineSweeperCore({ rowSize, columnSize });
      }).not.toThrow();
    });

    test("it should throw if constructor props are invalid", () => {
      expect(() => {
        new MineSweeperCore({ rowSize: 0, columnSize: -1 });
      }).toThrow();
    });

    test("board sizes should match constructor props", () => {
      const core = new MineSweeperCore({ rowSize, columnSize });

      expect(core["cellMineDatas"].length).toEqual(rowSize);
      core["cellMineDatas"].forEach(() => {
        expect(core["cellMineDatas"][0].length).toEqual(columnSize);
      });
    });
  });

  describe("Mine deployment behavior", () => {
    test("it should throw if mine count is invalid", () => {
      expect(() => {
        new MineSweeperCore({ rowSize, columnSize }).deployMines(-1);
      }).toThrow();

      expect(() => {
        new MineSweeperCore({ rowSize, columnSize }).deployMines(
          rowSize * columnSize + 1,
        );
      }).toThrow();
    });

    test.each([0.0, 0.01, 0.5, 0.99, 1.0])(
      "with percent of mines = %s, the deployed mine count should equal the it",
      (percentOfMines) => {
        const core = new MineSweeperCore({ rowSize, columnSize });

        const mineCount = Math.floor(rowSize * columnSize * percentOfMines);
        core.deployMines(mineCount);

        let result = 0;
        for (let r = 0; r < core["rowSize"]; ++r) {
          for (let c = 0; c < core["columnSize"]; ++c) {
            if (core.getMineData({ row: r, column: c }) === MineData.MINE)
              ++result;
          }
        }

        expect(result).toEqual(mineCount);
      },
    );

    test.todo("validate mine count after deployment");

    test.todo("deploy mines, validate mine data, swap a mine, validate again");

    test.todo("get random cell should be random");
  });

  // TODO Provide a helper to create a fixed board (with manually assigned mine and mine data)

  describe("Cell interactions", () => {
    // TODO tests should run with a fixed board

    test.todo("open a cell and check cell states including flood open result");

    test.todo("flag cell behavior");

    test.todo("clear adjacent cell behavior");
  });

  describe("Getter and setter behavior", () => {
    // TODO validateCell, getBar, setBar

    test.todo("throw with invalid cells");

    test.todo("no throw with ok cells");
  });

  describe("For 8 neighbor helper behavior", () => {
    test.todo("it should correctly count how many mines are nearby");
  });
});
