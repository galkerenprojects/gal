-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "verifies" TEXT,
    "reliabilityLevel" INTEGER NOT NULL DEFAULT 5,
    "reliability" TEXT NOT NULL DEFAULT 'לא אומת',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Source_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("createdAt", "id", "notes", "playerId", "reliability", "sourceType", "title", "url") SELECT "createdAt", "id", "notes", "playerId", "reliability", "sourceType", "title", "url" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
