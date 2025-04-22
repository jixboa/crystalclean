"use client";

import { Spinner } from "@material-tailwind/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen duration-300">
      <Spinner className="h-8 w-8 text-teal-900/50" />
    </div>
  );
}
