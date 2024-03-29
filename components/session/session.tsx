import { getTimeFromDate } from "@/lib/utils";
import { WorkSession } from "@prisma/client";
import Editor from "./editor/editor";
import { HTMLAttributes } from "react";
import { ArrowRight, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

interface Props extends HTMLAttributes<HTMLDivElement> {
  session: WorkSession & {
    endTime: Date;
  };
  i: number;
}

export default function Session({ session, i, ...props }: Props) {
  const startTime = getTimeFromDate(session.startTime);
  const endTime = getTimeFromDate(session.endTime);

  return (
    <Card {...props} className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="inline-flex justify-between items-center">
          <span>Session {i}</span>
          <div>
            <Button variant="ghost" size="icon">
              <Trash className="size-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="inline-flex gap-1 items-center">
          <span>{startTime}</span>
          <ArrowRight className="size-4" />
          <span>{endTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {session.notes ? (
          <Editor initialContent={session.notes} viewOnly />
        ) : (
          <span className="text-slate-400">
            You didn't take any notes during this session.
          </span>
        )}
      </CardContent>
    </Card>
  );
}
