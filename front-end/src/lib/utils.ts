import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateExtractor(date: Date | string | undefined | null): string {
  if (!date) return "";
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  return date.toISOString().split("T")[0];
}
