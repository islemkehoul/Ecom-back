import { Router } from 'express';
import {
  createProductVariant,
  getProductVariants,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant,
} from '../controllers/productVariants.controller';

const router = Router();

router.post('/', createProductVariant);
router.get('/', getProductVariants);
router.get('/:id', getProductVariantById);
router.put('/:id', updateProductVariant);
router.delete('/:id', deleteProductVariant);

export default router;
