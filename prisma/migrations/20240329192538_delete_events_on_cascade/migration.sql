-- DropForeignKey
ALTER TABLE "WorkSessionEvent" DROP CONSTRAINT "WorkSessionEvent_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "WorkSessionEvent" ADD CONSTRAINT "WorkSessionEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
