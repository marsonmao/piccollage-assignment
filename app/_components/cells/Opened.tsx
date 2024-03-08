import { ComponentProps } from "react";

export function Opened(
  props: ComponentProps<"div"> & {
    text: string;
  },
) {
  const { text, className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      {text}
    </div>
  );
}
