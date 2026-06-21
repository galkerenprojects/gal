-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "birthDate" TEXT,
    "birthYear" INTEGER NOT NULL,
    "currentClubId" TEXT,
    "previousClubs" TEXT,
    "position" TEXT NOT NULL,
    "secondaryPosition" TEXT,
    "region" TEXT NOT NULL,
    "league" TEXT,
    "ageGroup" TEXT,
    "appearances" INTEGER NOT NULL DEFAULT 0,
    "starts" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER,
    "assistsVerified" BOOLEAN NOT NULL DEFAULT false,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "formerTopClub" BOOLEAN NOT NULL DEFAULT false,
    "topClubName" TEXT,
    "stuckInU19" BOOLEAN NOT NULL DEFAULT false,
    "lateBloomer" BOOLEAN NOT NULL DEFAULT false,
    "playsAboveAge" BOOLEAN NOT NULL DEFAULT false,
    "realism" TEXT NOT NULL DEFAULT 'Medium',
    "score" INTEGER NOT NULL DEFAULT 0,
    "grade" TEXT NOT NULL DEFAULT 'C',
    "verificationStatus" TEXT NOT NULL DEFAULT 'לא מספיק נתונים',
    "isExampleData" BOOLEAN NOT NULL DEFAULT false,
    "filterTriggered" TEXT,
    "whyInteresting" TEXT,
    "nextAction" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Player_currentClubId_fkey" FOREIGN KEY ("currentClubId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'regular',
    "isTopClub" BOOLEAN NOT NULL DEFAULT false,
    "isTargetClub" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT,
    "league" TEXT,
    "ageGroup" TEXT,
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "homeTeamName" TEXT NOT NULL,
    "awayTeamName" TEXT NOT NULL,
    "result" TEXT,
    "round" TEXT,
    "isInterestingForScouting" BOOLEAN NOT NULL DEFAULT false,
    "scoutingReason" TEXT,
    "recommendedTeamToWatch" TEXT,
    "recommendedPositions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Club" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "yellowCard" BOOLEAN NOT NULL DEFAULT false,
    "redCard" BOOLEAN NOT NULL DEFAULT false,
    "shirtNumber" INTEGER,
    "positionInMatch" TEXT,
    "sourceUrl" TEXT,
    CONSTRAINT "PlayerMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "reliability" TEXT NOT NULL DEFAULT 'לא אומת',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Source_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoutNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT,
    "scoutName" TEXT NOT NULL,
    "videoUrl" TEXT,
    "minuteStart" INTEGER,
    "minuteEnd" INTEGER,
    "note" TEXT NOT NULL,
    "category" TEXT,
    "sentiment" TEXT NOT NULL DEFAULT 'ניטרלי',
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScoutNote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScoutNote_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
