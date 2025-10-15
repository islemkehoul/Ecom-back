import { DataSource } from "typeorm"  
import dotenv from 'dotenv';
import { Products } from "./entities/Products";
import { Orders } from "./entities/Orders";
import { ProductImages } from "./entities/ProductImages";
import { ProductVariants } from "./entities/ProductVariants";
dotenv.config();

export const AppDataSource = new DataSource({
type: "postgres",
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT || '5432'),
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
synchronize: true,
logging: true,
entities: [Products, ProductImages, Orders, ProductVariants],
subscribers: [],
migrations: [],
})

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};