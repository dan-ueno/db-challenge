-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_account_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_schedule_id_fkey";

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
