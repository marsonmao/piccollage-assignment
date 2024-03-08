"use client";

import { Link } from "@/app/_components";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <h1 className="m-2">Select mode</h1>
      <Link href="/classic">Classic</Link>
    </div>
  );
}
