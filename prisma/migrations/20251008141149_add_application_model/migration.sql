-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "coverLetter" TEXT,
    "resume" TEXT,
    "portfolioLink" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_internId_internshipId_key" ON "public"."applications"("internId", "internshipId");

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_internId_fkey" FOREIGN KEY ("internId") REFERENCES "public"."intern_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "public"."internships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
