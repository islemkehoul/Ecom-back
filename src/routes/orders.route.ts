import { Router} from "express";
import { orderValidationRules } from "../validators/order.validator";
import multer from 'multer';

const { createOrder, getAllOrders } = require('../controllers/orders.controllers');
const router = Router();

const textOnly = multer();

router.post(
  '/orders',
  textOnly.none(),
  orderValidationRules(),  
  createOrder
);

router.get('/orders', getAllOrders);

export default router;