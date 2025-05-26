"use client";

import { Suspense } from "react";
import Component from "../tracker";

function CalorieTrackerWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}

export default function Page() {
  return <CalorieTrackerWithSuspense />;
}
