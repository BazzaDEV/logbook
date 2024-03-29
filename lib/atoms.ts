import { WorkSession } from "@prisma/client";
import { Editor } from "@tiptap/react";
import { atom } from "jotai";

export const activeWorkSessionAtom = atom<WorkSession | undefined>(undefined);
export const editorAtom = atom<Editor | null>(null);
