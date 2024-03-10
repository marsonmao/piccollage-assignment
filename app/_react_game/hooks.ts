import { Cell as CellComponent } from "@/app/_components";
import { Cell, CellState, MineData } from "@/app/_game";
import { ComponentProps, useCallback } from "react";

type CellComponentProps = ComponentProps<typeof CellComponent>;

export function useCellProps<
  T extends {
    getState: (_cell: Cell) => CellState.All;
    getMineData: (_cell: Cell) => MineData.All;
  } & {
    [_P in keyof T]: Function;
  },
  U extends keyof CellComponentProps,
>({
  game,
  userActions,
  getAdditionalProps,
}: {
  game: T;
  userActions: Record<
    U,
    {
      gameMethod: keyof T;
      postUserAction: (_cell: Cell) => void;
    }
  >;
  getAdditionalProps?: (_cell: Cell) => Partial<CellComponentProps>;
}) {
  const getCellProps = useCallback(
    (cell: Cell) => {
      const userActionHandlers = Object.keys(userActions).reduce(
        (accu, key) => {
          const prop = key as keyof typeof userActions;

          accu[prop] = (e: React.MouseEvent<HTMLElement>) => {
            const { row, column } = e.currentTarget.dataset;

            const cell = {
              row: Number(row),
              column: Number(column),
            };

            const { gameMethod, postUserAction } = userActions[prop];

            game[gameMethod](cell);
            postUserAction(cell);
          };

          return accu;
        },
        {} as CellComponentProps,
      );

      const cellProps: CellComponentProps = {
        ...userActionHandlers,
        ...getAdditionalProps?.(cell),
        state: game.getState(cell),
        data: game.getMineData(cell),
        ["data-row"]: cell.row,
        ["data-column"]: cell.column,
      };
      return cellProps;
    },
    [game, userActions, getAdditionalProps],
  );

  return {
    getCellProps,
  };
}
