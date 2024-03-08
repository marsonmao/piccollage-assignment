import { ComponentProps } from "react";
import { cellClasses } from "./styles";

export function Opened(
  props: ComponentProps<"div"> & {
    text: string;
  },
) {
  const { text, ...rest } = props;

  return (
    <div className={cellClasses} {...rest}>
      {text}
    </div>
  );
}
