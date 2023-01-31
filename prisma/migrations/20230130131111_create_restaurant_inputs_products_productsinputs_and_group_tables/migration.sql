-- CreateTable
CREATE TABLE "restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "cnpj" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cod" TEXT NOT NULL,
    "und" TEXT NOT NULL,
    "cost_in_cents" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "groupsId" TEXT NOT NULL,
    CONSTRAINT "inputs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inputs_groupsId_fkey" FOREIGN KEY ("groupsId") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "sell_price_in_cents" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "products_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "productsId" TEXT NOT NULL,
    "inputsId" TEXT NOT NULL,
    CONSTRAINT "products_inputs_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_inputs_inputsId_fkey" FOREIGN KEY ("inputsId") REFERENCES "inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cod" INTEGER NOT NULL,
    "group_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "inputs_cod_key" ON "inputs"("cod");
