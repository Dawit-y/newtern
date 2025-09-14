-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('INTERN', 'ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."InternshipType" AS ENUM ('PAID', 'UNPAID', 'STIPEND');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('FILE', 'URL');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'INTERN',
    "name" TEXT,
    "image" TEXT,
    "emailVerified" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."intern_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "major" TEXT,
    "skills" TEXT,
    "bio" TEXT,

    CONSTRAINT "intern_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organization_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "industry" TEXT,
    "companySize" TEXT,
    "website" TEXT,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "internshipGoals" TEXT,

    CONSTRAINT "organization_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."internships" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "type" "public"."InternshipType" NOT NULL,
    "location" TEXT NOT NULL,
    "requirements" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "skills" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "background" TEXT,
    "videoUrl" TEXT,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "submissionInstructions" TEXT NOT NULL,
    "submitAsFile" BOOLEAN NOT NULL DEFAULT false,
    "submitAsText" BOOLEAN NOT NULL DEFAULT false,
    "submitAsUrl" BOOLEAN NOT NULL DEFAULT false,
    "internshipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "file" TEXT,
    "description" TEXT,
    "type" "public"."ResourceType" NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "intern_profile_userId_key" ON "public"."intern_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_profile_userId_key" ON "public"."organization_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "internships_slug_key" ON "public"."internships"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_slug_key" ON "public"."tasks"("slug");

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."intern_profile" ADD CONSTRAINT "intern_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_profile" ADD CONSTRAINT "organization_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."internships" ADD CONSTRAINT "internships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "public"."internships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
