import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type MakeRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>;

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
  const hours = d.getHours();
  const h = hours > 12 ? hours % 12 : hours;
  const m = d.getMinutes();
  const mm = m < 10 ? `0${m}` : m;
  const period = d.getHours() >= 12 ? "PM" : "AM";

  return `${h}:${mm} ${period}`;
}

type Greeting = "Good morning" | "Good afternoon" | "Good evening";

export function getGreeting(): Greeting {
  const hour = new Date().getHours(); // Get the current hour

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}
