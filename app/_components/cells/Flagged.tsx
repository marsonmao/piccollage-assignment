import { ComponentProps } from "react";

export function Flagged({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={className} {...rest}>
      {"F"}
    </div>
  );
}
