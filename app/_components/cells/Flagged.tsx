import { ComponentProps } from "react";
import { cellClasses } from "./styles";

export function Flagged(props: ComponentProps<"div">) {
  return (
    <div className={cellClasses} {...props}>
      {"F"}
    </div>
  );
}
