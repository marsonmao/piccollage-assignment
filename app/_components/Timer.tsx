"use client";

import { useLayoutEffect, useState } from "react";

const TICK_MS = 1000;

type MillieSecond = number;

function defaultFormatter(timestampMs: MillieSecond) {
  const asSecond = Math.floor(timestampMs / 1000);

  const hour = Math.floor(asSecond / 3600);
  const minute = Math.floor(asSecond / 60) % 60;
  const second = Math.floor(asSecond % 60);

  const hourText = `${hour > 0 ? hour.toString().padStart(2, "0") : ""}${hour > 0 ? ":" : ""}`;
  const minutText = `${minute.toString().padStart(2, "0")}:`;
  const secondText = `${second.toString().padStart(2, "0")}`;

  return `${hourText}${minutText}${secondText}`;
}

export function Timer({
  className,
  startTimestampMs,
  formatter = defaultFormatter,
  isRunning,
}: {
  className?: string;
  startTimestampMs: MillieSecond;
  formatter?: (_timestampMs: MillieSecond) => string;
  isRunning: boolean;
}) {
  const [elapsed, setElapsed] = useState(0);

  useLayoutEffect(() => {
    let id: number | undefined;

    if (isRunning) {
      id = window.setInterval(() => {
        setElapsed((v) => v + TICK_MS);
      }, TICK_MS);
    }

    return () => {
      window.clearInterval(id);
    };
  }, [isRunning]);

  useLayoutEffect(() => {
    setElapsed(0);
  }, [startTimestampMs]);

  return (
    <div
      className={`text-center ${className}`}
    >{`[ ${formatter(elapsed)} ]`}</div>
  );
}
