/*
  Warnings:

  - You are about to drop the column `productsId` on the `products_inputs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `products` table. All the data in the column will be lost.
  - Added the required column `final_productsId` to the `products_inputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `products_inputs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "processed_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sell_price_in_cents" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "processed_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "processed_products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "inputsId" TEXT NOT NULL,
    "procesedProductsId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "processed_products_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_procesedProductsId_fkey" FOREIGN KEY ("procesedProductsId") REFERENCES "processed_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "final_productsId" TEXT NOT NULL,
    "inputsId" TEXT NOT NULL,
    "procesedProductsId" TEXT,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "products_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_procesedProductsId_fkey" FOREIGN KEY ("procesedProductsId") REFERENCES "processed_inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_final_productsId_fkey" FOREIGN KEY ("final_productsId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products_inputs" ("id", "inputsId", "quantity") SELECT "id", "inputsId", "quantity" FROM "products_inputs";
DROP TABLE "products_inputs";
ALTER TABLE "new_products_inputs" RENAME TO "products_inputs";
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sell_price_in_cents" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "products_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("id", "name", "restaurantId", "sell_price_in_cents") SELECT "id", "name", "restaurantId", "sell_price_in_cents" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
