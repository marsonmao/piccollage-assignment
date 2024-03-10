import type { MouseEventHandler } from "react";

export const disableContextMenu: MouseEventHandler = (e) => {
  e.preventDefault();
};

export const boardCelebrationClasses =
  "bg-gradient-to-br from-red-300 from-10% via-yellow-300 via-sky-300 to-sky-300 to-90%";
