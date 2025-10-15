import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Products } from "../entities/Products";
import { ProductImages } from "../entities/ProductImages";

// Get the Product repository
const productRepository = AppDataSource.getRepository(Products);
const productImagesRepository = AppDataSource.getRepository(ProductImages);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find({
      relations: ['productImages','productVariants'], // Use 'productImages' as defined in the Products entity
    });
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const product = await productRepository.findOne({
      where: { id: id },
      relations: ['productImages','productVariants'],
    });
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    
    res.json({
      product: product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};


export const createProduct = async (req: Request, res: Response) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, name, price, description, category } = req.body;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  try {
    // Use a transaction to ensure atomicity
    const savedProduct = await productImagesRepository.manager.transaction(async (transactionalEntityManager) => {
      // Check for duplicate id
      if (id) {
        const existingProduct = await transactionalEntityManager.findOne(productRepository.metadata.target, { where: { id } });
        if (existingProduct) {
          throw new Error("A product with this ID already exists");
        }
      }

      // Create product instance
      const product = productRepository.create({
        id, // Include id if provided; omit if you want it auto-generated
        name,
        price,
        description,
        category,
      });

      // Save product
      const savedProduct = await transactionalEntityManager.save(productRepository.metadata.target, product);

      // Create ProductImages entries
      const productImages = files.map((file, index) => ({
        productId: savedProduct.id,
        imageUrl: file.filename,
        isMain: index === 0,
      }));

      // Save images
      await transactionalEntityManager.save(productImagesRepository.metadata.target, productImages);

      return { ...savedProduct, images: productImages };
    });

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error: any) {
    if (error.message === "A product with this ID already exists" || error.code === "23505") {
      return res.status(400).json({ message: "A product with this ID already exists" });
    }
    res.status(500).json({
      message: "Error creating product",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Find the product first
    const product = await productRepository.findOne({
      where: { id: id }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product
    await productRepository.remove(product);
    
    res.status(200).json({
      message: 'Product deleted successfully',
      product: product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    // Fetch all products
    const products = await productRepository.find();

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found to delete' });
    }

    // Delete all products
    await productRepository.remove(products);

    res.status(200).json({
      message: 'All products deleted successfully',
      deletedCount: products.length,
      products: products, // Optionally return deleted products for reference
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, category } = req.body;
  const image = req.file?.filename;
  
  try {
    // Find the product
    const product = await productRepository.findOne({
      where: { id: id }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields if provided
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    // if (image !== undefined) product.image = image;
    
    // Check if any field was updated
    if (name === undefined && price === undefined && description === undefined && 
        category === undefined && image === undefined) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Save the updated product
    const updatedProduct = await productRepository.save(product);
    
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};