import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Orders } from "../entities/Orders";
import { Products } from "../entities/Products";

// Get the Orders repository
const ordersRepository = AppDataSource.getRepository(Orders);
const productsRepository = AppDataSource.getRepository(Products);

export const createOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);
  
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { product_id, customer_name, customer_phone, customer_city, customer_region, variant_sku } = req.body;

  try {
    // Optional: Verify that the product exists
    const productExists = await productsRepository.findOne({
      where: { id: product_id }
    });
    
    if (!productExists) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    
    // Create a new order instance
    const order = ordersRepository.create({
      productId: product_id,
      customerName: customer_name,
      customerPhone: customer_phone,
      customerCity: customer_city,
      customerRegion: customer_region,
      sku: variant_sku // SKU can be null
    });
    
    // Save to database
    const savedOrder = await ordersRepository.save(order);
    
    res.status(201).json({
      message: 'Order created successfully!',
      order: savedOrder.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Fetch all orders with product details using relation
    const orders = await ordersRepository.find({
       // This will join with Products table
    });
    
    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found'
      });
    }
    
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving orders",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const order = await ordersRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['product'] // Include product details
    });
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      message: 'Order retrieved successfully',
      order: order
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving order",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const order = await ordersRepository.findOne({
      where: { id: parseInt(id) }
    });
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    
    await ordersRepository.remove(order);
    
    res.status(200).json({
      message: 'Order deleted successfully',
      order: order
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting order",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product_id, customer_name, customer_phone, customer_city, customer_region } = req.body;
  
  try {
    const order = await ordersRepository.findOne({
      where: { id: parseInt(id) }
    });
    
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    
    // If product_id is being updated, verify the new product exists
    if (product_id !== undefined) {
      const productExists = await productsRepository.findOne({
        where: { id: product_id }
      });
      
      if (!productExists) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      
      order.productId = product_id;
    }
    
    // Update other fields if provided
    if (customer_name !== undefined) order.customerName = customer_name;
    if (customer_phone !== undefined) order.customerPhone = customer_phone;
    if (customer_city !== undefined) order.customerCity = customer_city;
    if (customer_region !== undefined) order.customerRegion = customer_region;
    
    // Check if any field was updated
    if (product_id === undefined && customer_name === undefined && 
        customer_phone === undefined && customer_city === undefined && 
        customer_region === undefined) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Save the updated order
    const updatedOrder = await ordersRepository.save(order);
    
    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getOrdersByLocation = async (req: Request, res: Response) => {
  const { city, region } = req.query;
  
  try {
    const whereCondition: any = {};
    
    if (city) whereCondition.customerCity = city;
    if (region) whereCondition.customerRegion = region;
    
    if (Object.keys(whereCondition).length === 0) {
      return res.status(400).json({
        message: 'Please provide city or region parameter'
      });
    }
    
    const orders = await ordersRepository.find({
      where: whereCondition,
      relations: ['product']
    });
    
    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for the specified location'
      });
    }
    
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving orders",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};