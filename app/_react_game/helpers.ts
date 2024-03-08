import type { MouseEventHandler } from "react";

export const disableContextMenu: MouseEventHandler = (e) => {
  e.preventDefault();
};
