"use client";

import { activeWorkSessionAtom, editorAtom } from "@/lib/atoms";
import Placeholder from "@tiptap/extension-placeholder";
import { Transaction } from "@tiptap/pm/state";
import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useRenderCount } from "@uidotdev/usehooks";

interface Props {
  updateSessionNotes: (notes: string) => void;
}

export default function Editor({ updateSessionNotes }: Props) {
  const [activeSession] = useAtom(activeWorkSessionAtom);
  const [editor, setEditor] = useAtom(editorAtom);
  const renderCount = useRenderCount();

  const onEditorUpdate = useCallback(
    (editor: TiptapEditor) => {
      if (!activeSession) {
        // No active session, do nothing
        return;
      }

      // Save notes to database (debounced)
      const notes = JSON.stringify(editor.getJSON());

      updateSessionNotes(notes);
    },
    [activeSession],
  );

  useEffect(() => {
    setEditor(
      new TiptapEditor({
        onUpdate: function ({ editor }) {
          onEditorUpdate(editor);
        },
        content: activeSession?.notes ? JSON.parse(activeSession?.notes) : null,
        extensions: [
          StarterKit.configure({
            heading: false,
            codeBlock: false,
            blockquote: false,
          }),
          Placeholder.configure({
            placeholder: "What are you working on?",
          }),
        ],
        editorProps: {
          attributes: {
            class:
              "max-w-full prose prose-slate dark:prose-invert prose-base focus:outline-none prose-p:m-0 prose-p:p-0 border rounded-md p-4",
          },
        },
      }),
    );
  }, [activeSession]);
  return (
    <div>
      <EditorContent editor={editor} />
      {/* <div>Render count: {renderCount}</div> */}
    </div>
  );
}
