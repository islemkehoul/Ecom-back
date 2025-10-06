import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Products } from "../entities/Products";

// Get the Product repository
const productRepository = AppDataSource.getRepository(Products);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find();
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const product = await productRepository.findOne({
      where: { id: id }
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
  console.log(req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id, name, price, description, category } = req.body;
  const image = req.file ? req.file.filename : undefined;
  
  try {
    // Create a new product instance
    const product = productRepository.create({
      id,
      name,
      price,
      description,
      category,
      image
    });
    
    // Save to database
    const savedProduct = await productRepository.save(product);
    
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error instanceof Error ? error.message : String(error)
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
    if (image !== undefined) product.image = image;
    
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