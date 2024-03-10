import { Closed, Flagged, Mine, Opened } from "@/app/_components/cells";
import { CellState, MineData } from "@/app/_game";
import { exhaustiveCaseCheck } from "@/app/_utils";
import { ComponentProps } from "react";

type CellProps = ComponentProps<"div"> & {
  [key: `data-${string}`]: unknown;
} & {
  state: CellState.All;
  data: MineData.All;
};

export const CELL_CLASSES = `
  inline-flex justify-center items-center\
  rounded-sm border p-1\
  cursor-pointer select-none\
  text-black bg-white\
  w-[32px] h-[32px]\
`;

function renderCell({ state, data, ...rest }: CellProps) {
  switch (state) {
    case CellState.CLOSED: {
      return <Closed {...rest} />;
    }
    case CellState.FLAGGED: {
      return <Flagged {...rest} />;
    }
    case CellState.OPENED: {
      if (data === MineData.MINE) return <Mine {...rest} />;

      return <Opened {...rest} text={data === 0 ? "" : data.toString()} />;
    }
  }
  exhaustiveCaseCheck({
    value: state,
    message: `Unhandled state found: ${state}`,
  });
}

export function Cell({ className, ...rest }: CellProps) {
  return renderCell({
    ...rest,
    className: `${CELL_CLASSES} ${className ?? ""}`,
  });
}
