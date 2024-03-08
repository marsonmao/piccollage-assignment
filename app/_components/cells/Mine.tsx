import { ComponentProps } from "react";

export function Mine({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div className={className} {...rest}>
      {"M"}
    </div>
  );
}
