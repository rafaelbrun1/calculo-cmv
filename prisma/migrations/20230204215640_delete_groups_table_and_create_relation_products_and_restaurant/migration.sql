/*
  Warnings:

  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `groupsId` on the `inputs` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "groups";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cod" TEXT,
    "und" TEXT NOT NULL,
    "cost_in_cents" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inputs" ("cod", "cost_in_cents", "id", "name", "restaurantId", "und") SELECT "cod", "cost_in_cents", "id", "name", "restaurantId", "und" FROM "inputs";
DROP TABLE "inputs";
ALTER TABLE "new_inputs" RENAME TO "inputs";
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "sell_price_in_cents" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "products_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("id", "name", "sell_price_in_cents", "type") SELECT "id", "name", "sell_price_in_cents", "type" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
