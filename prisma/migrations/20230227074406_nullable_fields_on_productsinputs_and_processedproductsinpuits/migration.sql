-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "final_productsId" TEXT NOT NULL,
    "inputsId" TEXT,
    "procesedProductsId" TEXT,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "products_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_procesedProductsId_fkey" FOREIGN KEY ("procesedProductsId") REFERENCES "processed_inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_final_productsId_fkey" FOREIGN KEY ("final_productsId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products_inputs" ("final_productsId", "id", "inputsId", "procesedProductsId", "quantity", "restaurantId") SELECT "final_productsId", "id", "inputsId", "procesedProductsId", "quantity", "restaurantId" FROM "products_inputs";
DROP TABLE "products_inputs";
ALTER TABLE "new_products_inputs" RENAME TO "products_inputs";
CREATE TABLE "new_processed_products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "inputsId" TEXT,
    "procesedProductsId" TEXT,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "processed_products_inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_procesedProductsId_fkey" FOREIGN KEY ("procesedProductsId") REFERENCES "processed_inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "processed_products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_processed_products_inputs" ("id", "inputsId", "procesedProductsId", "quantity", "restaurantId") SELECT "id", "inputsId", "procesedProductsId", "quantity", "restaurantId" FROM "processed_products_inputs";
DROP TABLE "processed_products_inputs";
ALTER TABLE "new_processed_products_inputs" RENAME TO "processed_products_inputs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
