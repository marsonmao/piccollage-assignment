import { ComponentProps } from "react";

export function Closed({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={className} {...rest}>
      {"[]"}
    </div>
  );
}
