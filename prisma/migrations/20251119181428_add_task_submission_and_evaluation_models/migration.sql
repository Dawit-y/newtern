-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."task_submissions" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "textContent" TEXT,
    "fileUrl" TEXT,
    "url" TEXT,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',

    CONSTRAINT "task_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_evaluations" (
    "id" TEXT NOT NULL,
    "taskSubmissionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_submissions_taskId_internId_key" ON "public"."task_submissions"("taskId", "internId");

-- CreateIndex
CREATE UNIQUE INDEX "task_evaluations_taskSubmissionId_key" ON "public"."task_evaluations"("taskSubmissionId");

-- AddForeignKey
ALTER TABLE "public"."task_submissions" ADD CONSTRAINT "task_submissions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_submissions" ADD CONSTRAINT "task_submissions_internId_fkey" FOREIGN KEY ("internId") REFERENCES "public"."intern_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_evaluations" ADD CONSTRAINT "task_evaluations_taskSubmissionId_fkey" FOREIGN KEY ("taskSubmissionId") REFERENCES "public"."task_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_evaluations" ADD CONSTRAINT "task_evaluations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
