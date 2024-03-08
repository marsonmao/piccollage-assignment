import { Closed, Flagged, Mine, Opened } from "@/app/_components/cells";
import { CellState, MineData } from "@/app/_game";
import { exhaustiveCaseCheck } from "@/app/_utils";
import { ComponentProps } from "react";

type CellProps = {
  state: CellState.All;
  data: MineData.All;
};

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

      return <Opened {...rest} text={data.toString()} />;
    }
  }
  exhaustiveCaseCheck({
    value: state,
    message: `Unhandled state found: ${state}`,
  });
}

export function Cell(props: ComponentProps<"div"> & CellProps) {
  return renderCell(props);
}
