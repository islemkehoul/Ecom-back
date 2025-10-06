import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/products.route';
import orderRouter from './routes/orders.route';
import "reflect-metadata";
import { initializeDatabase } from './data-source';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1', productRouter);
app.use('/api/v1', orderRouter);

const startServer = async () => {
  try {
    // Initialize TypeORM database connection
    await initializeDatabase();
    
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
