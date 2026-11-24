import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "2023-01-01" -> "Jan 2023". Dates are ISO calendar dates, so format in UTC to avoid off-by-one days. */
export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatPeriod(startDate: string, endDate?: string | null): string {
  return `${formatMonthYear(startDate)} — ${endDate ? formatMonthYear(endDate) : "Present"}`;
}
