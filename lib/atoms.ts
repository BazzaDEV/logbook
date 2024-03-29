import { WorkSession } from "@prisma/client";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { atom } from "jotai";

export const activeWorkSessionAtom = atom<WorkSession | undefined>(undefined);
export const editorAtom = atom<Editor | null>(null);
