-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "name" TEXT,
    "species" TEXT NOT NULL,
    "description" TEXT,
    "neighborhood" TEXT NOT NULL,
    "primaryPhotoUrl" TEXT NOT NULL,
    "contactInfo" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Sighting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT,
    "species" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "locationText" TEXT NOT NULL,
    "seenAt" DATETIME NOT NULL,
    "notes" TEXT,
    "waitMinutes" INTEGER,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByViewerId" TEXT NOT NULL,
    CONSTRAINT "Sighting_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "sightingId" TEXT,
    "body" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByViewerId" TEXT NOT NULL,
    CONSTRAINT "Comment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_sightingId_fkey" FOREIGN KEY ("sightingId") REFERENCES "Sighting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByViewerId" TEXT NOT NULL
);

CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByViewerId" TEXT NOT NULL
);

CREATE TABLE "Reunion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "confirmedAt" DATETIME NOT NULL,
    "confirmedByViewerId" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "Reunion_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "GamificationEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ViewerProfile" (
    "viewerId" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT,
    "stewardLevel" TEXT NOT NULL DEFAULT 'VISITOR',
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Badge_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "ViewerProfile" ("viewerId") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Vote_targetType_targetId_createdByViewerId_key" ON "Vote"("targetType", "targetId", "createdByViewerId");
CREATE UNIQUE INDEX "Badge_viewerId_type_key" ON "Badge"("viewerId", "type");
