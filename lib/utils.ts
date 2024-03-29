import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getTimeFromDate(d: Date) {
  const h = d.getHours() % 12;
  const m = d.getMinutes();
  const mm = m < 10 ? `0${m}` : m;
  const period = d.getHours() >= 12 ? "PM" : "AM";

  return `${h}:${mm} ${period}`;
}
