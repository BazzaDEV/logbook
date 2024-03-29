"use client";

import "@/components/editor/prosemirror.css";

import {
  EditorContent,
  EditorRoot,
  JSONContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
} from "novel";
import { defaultExtensions } from "./extensions";
import { suggestionItems, slashCommand } from "./slash-menu";
import { handleCommandNavigation } from "novel/extensions";
import { useAtom } from "jotai";
import { editorAtom } from "@/lib/atoms";

const extensions = [...defaultExtensions, slashCommand];

interface Props {
  updateSessionNotes?: (notes: string) => void;
  viewOnly?: boolean;
  initialContent?: string | null | undefined;
}

const Editor = ({
  updateSessionNotes,
  viewOnly = false,
  initialContent,
}: Props) => {
  const [, setEditor] = useAtom(editorAtom);

  const initialContentJSON = initialContent ? JSON.parse(initialContent) : null;

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          className="relative w-full max-w-screen-lg bg-background sm:mb-[calc(20vh)] sm:rounded-lg"
          onUpdate={({ editor }) => {
            setEditor(editor);
            const json = editor.getJSON();
            const str = JSON.stringify(json);
            updateSessionNotes(str);
          }}
          initialContent={initialContentJSON}
          editable={!viewOnly}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: `prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-sm text-muted-foreground">
              No results.
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) =>
                    item.command ? item.command(val) : false
                  }
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
