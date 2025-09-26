import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/products.route';
import orderRouter from './routes/orders.route';



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1', productRouter);
app.use('/api/v1', orderRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});