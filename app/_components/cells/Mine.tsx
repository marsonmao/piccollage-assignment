import { ComponentProps } from "react";

export function Mine({
  className,
  textClass,
  ...rest
}: ComponentProps<"div"> & { textClass?: string }) {
  return (
    <div className={className} {...rest}>
      <span className={textClass}>💣</span>
    </div>
  );
}
