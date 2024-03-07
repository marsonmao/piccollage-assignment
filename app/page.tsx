"use client";

import { useEffect } from "react";
import { MineSweeperCore } from "./_manager";

const msm = new MineSweeperCore({
  rowSize: 4,
  columnSize: 4,
  maxLifeCount: 1,
});

msm.deployMinesFromCell({ row: 0, column: 0 }, 2);
msm.openCell({ row: 0, column: 0 });

export default function Home() {
  console.log(msm.getCellMineDatas());
  console.log(msm.getCellStates());
  return <div>1</div>;
}
