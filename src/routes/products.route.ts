import { Router,Request,Response} from "express";
import multer from 'multer';
import express from "express";
import { productValidationRules } from "../validators/product.validator";

const { getAllProducts,getProductById,createProduct,deleteProduct,updateProduct  } = require('../controllers/product.controller');

type FileNameCallback = (error: Error | null, filename: string) => void
const router = Router();


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req:Request, file:Express.Multer.File, cb: FileNameCallback):void => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
router.use("/products/uploads", express.static("uploads"));

router.get("/products", getAllProducts);

router.get("/products/:id", getProductById);


router.post(
  "/products",
  upload.single("image"),
  productValidationRules(),
  createProduct
);

router.delete("/products/:id",deleteProduct);

router.patch("/products/:id",upload.single("image"), updateProduct);

export default router;