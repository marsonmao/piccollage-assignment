import NextLink from "next/link";
import { ComponentProps } from "react";

export function Link(props: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className="border p-1 rounded-md transition-colo hover:font-bold"
      {...props}
    />
  );
}
