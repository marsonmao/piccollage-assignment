"use client";

import { Link } from "@/app/_components";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <h1 className="m-2">Select mode</h1>
      <div className="w-full flex justify-center items-center flex-col gap-1">
        <Link href="/classic">Classic</Link>
        <Link href="/detonation">Detonation</Link>
      </div>
    </div>
  );
}
