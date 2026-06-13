import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class merging helper */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency (NGN) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format an ISO date string to a human-readable date */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date string to date + time */
export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Returns true when a product is considered low-stock */
export function isLowStock(quantity: number, reorderLevel: number): boolean {
  return quantity <= reorderLevel;
}

/** Generate a stable unique ID for optimistic / local data */
export function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}
