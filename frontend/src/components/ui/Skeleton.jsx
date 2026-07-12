import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div
    className={`
      animate-pulse rounded-md bg-subtle
      ${className}
    `}
    aria-hidden="true"
  />
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="rounded-lg border border-border bg-surface p-5" aria-hidden="true">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <Skeleton className="h-5 w-2/3 mb-2" />
    <Skeleton className="h-3 w-full mb-1" />
    {lines > 2 && <Skeleton className="h-3 w-5/6 mb-4" />}
    <Skeleton className="h-8 w-full rounded-md" />
  </div>
);

export const SkeletonText = ({ lines = 2, className = "" }) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-4/5" : "w-full"}`} />
    ))}
  </div>
);
