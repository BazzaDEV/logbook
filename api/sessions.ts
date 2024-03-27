"use server";

import { WorkSession } from "@prisma/client";
import prisma from "@/lib/db";

export async function getSessions(userId: string) {
  const sessions = await prisma.workSession.findMany({
    where: {
      userId,
    },
  });

  return sessions;
}

export async function startSession(
  data: Omit<WorkSession, "id" | "startTime">,
) {
  const session = await prisma.workSession.create({
    data,
  });

  await prisma.workSessionEvent.create({
    data: {
      sessionId: session.id,
      type: "START",
    },
  });

  return session;
}

export async function updateSession(data: Pick<WorkSession, "id" | "notes">) {
  await prisma.workSession.update({
    where: {
      id: data.id,
    },
    data,
  });
}

export async function pauseSession(data: Pick<WorkSession, "id">) {
  const { id: sessionId } = data;

  const event = await prisma.workSessionEvent.create({
    data: {
      sessionId,
      type: "PAUSE",
    },
  });

  return event;
}

export async function resumeSession(data: Pick<WorkSession, "id">) {
  const { id: sessionId } = data;

  const event = await prisma.workSessionEvent.create({
    data: {
      sessionId,
      type: "RESUME",
    },
  });

  return event;
}

export async function endSession(data: Pick<WorkSession, "id">) {
  const { id: sessionId } = data;

  await prisma.workSession.update({
    where: {
      id: sessionId,
    },
    data: {
      endTime: new Date(),
    },
  });

  await prisma.workSessionEvent.create({
    data: {
      sessionId,
      type: "END",
    },
  });
}
