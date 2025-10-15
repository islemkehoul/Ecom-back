import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { ProductVariants } from '../entities/ProductVariants';
import { Products } from '../entities/Products';

export const createProductVariant = async (req: Request, res: Response) => {
  try {
    req.body.forEach(async(element:any) => {
      const { productId, size, color, quantity, price } = element;
       const productRepository = AppDataSource.getRepository(Products);
    const product = await productRepository.findOneBy({ id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const generatedSku = `${productId}-${size}-${color}`;
    const productVariantRepository = AppDataSource.getRepository(ProductVariants);
    const newProductVariant = productVariantRepository.create({
      product,
      size,
      color,
      quantity,
      sku: generatedSku,
      price,
    });
    await productVariantRepository.save(newProductVariant);

    }
  );
    res.status(201).json({"message" : "Product variant created succesfully!"});

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product variant' });
  }
};

export const getProductVariants = async (req: Request, res: Response) => {
  try {
    const productVariantRepository = AppDataSource.getRepository(ProductVariants);
    const productVariants = await productVariantRepository.find({
      relations: ['product'],
    });
    res.status(200).json(productVariants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product variants' });
  }
};

export const getProductVariantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productVariantRepository = AppDataSource.getRepository(ProductVariants);
    const productVariant = await productVariantRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['product'],
    });

    if (!productVariant) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    res.status(200).json(productVariant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product variant' });
  }
};

export const updateProductVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { size, color, quantity, sku, price } = req.body;

    const productVariantRepository = AppDataSource.getRepository(ProductVariants);
    let productVariant = await productVariantRepository.findOneBy({ id: parseInt(id) });

    if (!productVariant) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    productVariantRepository.merge(productVariant, { size, color, quantity, sku, price });
    await productVariantRepository.save(productVariant);

    res.status(200).json(productVariant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product variant' });
  }
};

export const deleteProductVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productVariantRepository = AppDataSource.getRepository(ProductVariants);
    const result = await productVariantRepository.delete(parseInt(id));

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product variant' });
  }
};
