"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <h1 className="m-2">Select mode</h1>
      <Link
        className="border p-1 rounded-md transition-colors hover:bg-slate-100"
        href="/classic"
      >
        Classic
      </Link>
    </div>
  );
}
