"use client";

import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Props {
  column: string;
  label: string;
  basePath: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
  className?: string;
}

export default function SortableHeader({
  column,
  label,
  basePath,
  currentSort,
  currentOrder,
  className,
}: Props) {
  const isActive = currentSort === column;
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";
  const href = `${basePath}?sort=${column}&order=${nextOrder}`;

  return (
    <th className={`text-left px-5 py-3 text-gray-500 font-medium ${className ?? ""}`}>
      <Link
        href={href}
        className="inline-flex items-center gap-1 hover:text-gray-800 transition-colors select-none whitespace-nowrap"
      >
        {label}
        {isActive ? (
          currentOrder === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <ChevronsUpDown className="w-3 h-3 opacity-40" />
        )}
      </Link>
    </th>
  );
}
