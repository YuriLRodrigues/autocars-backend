/*
  Warnings:

  - The values [Aston Martin,Citroën,Land Rover,Rolls Royce] on the enum `Brand` will be removed. If these variants are still used in the database, this will fail.
  - The values [2,4,5,6] on the enum `Capacity` will be removed. If these variants are still used in the database, this will fail.
  - The values [2,3,4] on the enum `Doors` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `km` to the `Advertisement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localization` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Brand_new" AS ENUM ('Chevrolet', 'Ford', 'Mustang', 'Honda', 'KWID', 'Fiat', 'Porsche', 'Mercedes', 'Agrale', 'Aston_Martin', 'Audi', 'BMW', 'Citroen', 'Ferrari', 'Hyundai', 'Jeep', 'Jaguar', 'Kia', 'Lamborghini', 'Land_Rover', 'Lexus', 'Maserati', 'McLaren', 'Mitsubishi', 'Nissan', 'Peugeot', 'RAM', 'Renault', 'Rolls_Royce', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo');
ALTER TABLE "Advertisement" ALTER COLUMN "brand" TYPE "Brand_new" USING ("brand"::text::"Brand_new");
ALTER TYPE "Brand" RENAME TO "Brand_old";
ALTER TYPE "Brand_new" RENAME TO "Brand";
DROP TYPE "Brand_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Capacity_new" AS ENUM ('Two', 'Four', 'Five', 'Six');
ALTER TABLE "Advertisement" ALTER COLUMN "capacity" TYPE "Capacity_new" USING ("capacity"::text::"Capacity_new");
ALTER TYPE "Capacity" RENAME TO "Capacity_old";
ALTER TYPE "Capacity_new" RENAME TO "Capacity";
DROP TYPE "Capacity_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Doors_new" AS ENUM ('Two', 'Three', 'Four');
ALTER TABLE "Advertisement" ALTER COLUMN "doors" TYPE "Doors_new" USING ("doors"::text::"Doors_new");
ALTER TYPE "Doors" RENAME TO "Doors_old";
ALTER TYPE "Doors_new" RENAME TO "Doors";
DROP TYPE "Doors_old";
COMMIT;

-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "km" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "localization" TEXT NOT NULL;
