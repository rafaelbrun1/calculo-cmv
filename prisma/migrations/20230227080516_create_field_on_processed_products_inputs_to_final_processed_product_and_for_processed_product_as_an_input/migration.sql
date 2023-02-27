/*
  Warnings:

  - Made the column `procesedProductsId` on table `processed_products_inputs` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_processed_products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "procesedProductsId" TEXT NOT NULL,
    "processedProductsIdAsInput" TEXT,
    "inputsId" TEXT,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "processed_products_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_procesedProductsId_fkey" FOREIGN KEY ("procesedProductsId") REFERENCES "processed_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_processedProductsIdAsInput_fkey" FOREIGN KEY ("processedProductsIdAsInput") REFERENCES "processed_inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_processed_products_inputs" ("id", "inputsId", "procesedProductsId", "quantity", "restaurantId") SELECT "id", "inputsId", "procesedProductsId", "quantity", "restaurantId" FROM "processed_products_inputs";
DROP TABLE "processed_products_inputs";
ALTER TABLE "new_processed_products_inputs" RENAME TO "processed_products_inputs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
