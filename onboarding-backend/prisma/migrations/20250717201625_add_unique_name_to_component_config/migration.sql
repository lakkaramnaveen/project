/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ComponentConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ComponentConfig_name_key" ON "ComponentConfig"("name");
