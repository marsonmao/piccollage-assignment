"use client";

import { useCallback, useEffect, useState } from "react";
import { MineSweeperClassicMode } from "./_manager";

// const msm = new MineSweeperClassicMode({});
// msm.deployMinesFromCell({ row: 0, column: 0 }, 2);
// msm.openCell({ row: 0, column: 0 });

export default function Home() {
  const onGameEnd = useCallback(() => {
    console.log(1);
  }, []);
  const [game] = useState(
    () =>
      new MineSweeperClassicMode({
        onGameEnd,
      })
  );

  return (
    <div>
      <button
        onClick={() =>
          game.startGame({
            cell: { row: 0, column: 0 },
            size: { row: 8, column: 8 },
            mineCount: 12,
          })
        }
      >
        start
      </button>
      <div>123</div>
    </div>
  );
}
