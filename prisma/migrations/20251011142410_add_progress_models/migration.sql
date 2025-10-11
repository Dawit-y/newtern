-- CreateEnum
CREATE TYPE "public"."InternshipStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."internship_progress" (
    "id" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."InternshipStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "internship_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_progress" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "task_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "internship_progress_internId_internshipId_key" ON "public"."internship_progress"("internId", "internshipId");

-- CreateIndex
CREATE UNIQUE INDEX "task_progress_taskId_internId_key" ON "public"."task_progress"("taskId", "internId");

-- AddForeignKey
ALTER TABLE "public"."internship_progress" ADD CONSTRAINT "internship_progress_internId_fkey" FOREIGN KEY ("internId") REFERENCES "public"."intern_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."internship_progress" ADD CONSTRAINT "internship_progress_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "public"."internships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_internId_fkey" FOREIGN KEY ("internId") REFERENCES "public"."intern_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
