import { ComponentProps } from "react";
import { cellClasses } from "./styles";

export function Mine(props: ComponentProps<"div">) {
  return (
    <div className={cellClasses} {...props}>
      {"M"}
    </div>
  );
}
