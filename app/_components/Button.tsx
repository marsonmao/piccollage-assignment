import { ComponentProps } from "react";

export function Button(props: ComponentProps<"button">) {
  const { className: classNameProp, ...rest } = props;
  const baseClasses =
    "rounded-md border p-1 text-black bg-white hover:font-bold";

  return <button className={`${classNameProp} ${baseClasses}`} {...rest} />;
}
