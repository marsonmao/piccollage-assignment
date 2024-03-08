import { ComponentProps } from "react";
import { cellClasses } from "./styles";

export function Closed(props: ComponentProps<"div">) {
  return (
    <div className={cellClasses} {...props}>
      {"[]"}
    </div>
  );
}
