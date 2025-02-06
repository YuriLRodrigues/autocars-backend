-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Manager', 'Seller', 'Customer');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('Chevrolet', 'Ford', 'Mustang', 'Honda', 'KWID', 'Fiat', 'Porsche', 'Mercedes', 'Agrale', 'Aston Martin', 'Audi', 'BMW', 'Citroën', 'Ferrari', 'Hyundai', 'Jeep', 'Jaguar', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'McLaren', 'Mitsubishi', 'Nissan', 'Peugeot', 'RAM', 'Renault', 'Rolls Royce', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo');

-- CreateEnum
CREATE TYPE "Doors" AS ENUM ('2', '3', '4');

-- CreateEnum
CREATE TYPE "Model" AS ENUM ('SUV', 'Sedan', 'Hatch', 'Pickups', 'Crossover', 'Stilt', 'Minivan', 'Sport', 'Van', 'Coupe');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('Red', 'Black', 'Green', 'Silver', 'White', 'Blue', 'Gray', 'Yellow', 'Orange', 'Metalic', 'Pink', 'Purple');

-- CreateEnum
CREATE TYPE "GearBox" AS ENUM ('Automatic', 'Manual');

-- CreateEnum
CREATE TYPE "Fuel" AS ENUM ('Gasoline', 'Flex', 'Ethanol', 'Diesel', 'GNV', 'Eletric');

-- CreateEnum
CREATE TYPE "Capacity" AS ENUM ('2', '4', '5', '6');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "advertisementId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "details" TEXT[],
    "brand" "Brand" NOT NULL,
    "doors" "Doors" NOT NULL,
    "model" "Model" NOT NULL,
    "color" "Color" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "wasSold" BOOLEAN NOT NULL,
    "onSale" BOOLEAN NOT NULL,
    "salePrice" TEXT NOT NULL,
    "gearBox" "GearBox" NOT NULL,
    "fuel" "Fuel" NOT NULL,
    "capacity" "Capacity" NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
