import type { Cell } from "@/app/_game";
import type { ComponentProps, ComponentType } from "react";

type BoardProps<P> = {
  rowSize: number;
  columnSize: number;
  CellComponent: ComponentType<P>;
  getCellProps: (_cell: Cell) => ComponentProps<BoardProps<P>["CellComponent"]>;
};

function Row<P>({
  rowIndex,
  columnSize,
  CellComponent,
  getCellProps,
}: {
  rowIndex: number;
} & Pick<BoardProps<P>, "columnSize" | "CellComponent" | "getCellProps">) {
  const cells = Array.from({ length: columnSize }).map<JSX.Element>(
    (_, columnIndex) => (
      <CellComponent
        key={columnIndex.toString()}
        {...getCellProps({ row: rowIndex, column: columnIndex })}
      />
    ),
  );
  return <div className="flex w-full justify-start items-start">{cells}</div>;
}

export function Board<P>(props: ComponentProps<"div"> & BoardProps<P>) {
  const {
    className,
    rowSize,
    columnSize,
    CellComponent,
    getCellProps,
    ...rest
  } = props;

  return (
    <div className={className} {...rest}>
      {Array.from({ length: rowSize }).map((_, rowIndex) => (
        <Row
          key={rowIndex.toString()}
          rowIndex={rowIndex}
          columnSize={columnSize}
          CellComponent={CellComponent}
          getCellProps={getCellProps}
        />
      ))}
    </div>
  );
}
