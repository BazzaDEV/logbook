import { WorkSession } from "@prisma/client";
import { atom } from "jotai";

export const activeWorkSession = atom<WorkSession | undefined>(undefined);
