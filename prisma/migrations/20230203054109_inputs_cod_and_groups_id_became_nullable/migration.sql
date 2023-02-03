-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cod" TEXT,
    "und" TEXT NOT NULL,
    "cost_in_cents" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "groupsId" TEXT,
    CONSTRAINT "inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inputs_groupsId_fkey" FOREIGN KEY ("groupsId") REFERENCES "groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_inputs" ("cod", "cost_in_cents", "groupsId", "id", "name", "restaurantId", "und") SELECT "cod", "cost_in_cents", "groupsId", "id", "name", "restaurantId", "und" FROM "inputs";
DROP TABLE "inputs";
ALTER TABLE "new_inputs" RENAME TO "inputs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
