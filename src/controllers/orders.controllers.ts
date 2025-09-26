import { Request,Response } from "express";
import pool from '../db/db';
import { validationResult } from "express-validator";
const createOrder = async(req:Request,res:Response) => 
{
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(400).json({errors:errors.array()});
    }
const {product_id,customer_name,customer_phone,customer_city,customer_region}= req.body;
const query = 'INSERT INTO Orders (product_id, customer_name, customer_phone, customer_city, customer_region) VALUES($1, $2, $3, $4, $5) RETURNING *';

try{
 const result = await pool.query(query,[product_id,customer_name,customer_phone,customer_city,customer_region]);
    if(result.rows.length === 0 )
    {
        res.status(404).json({
            message:'Failed to create order'
        })
    }
    res.status(201).json({
        message:'Order created successfully!',
        order:`${result.rows[0].id}`
    });
}
catch(error)
{
    res.status(500).json({
      message:"Error creating order",
      error: error instanceof Error ? error.message : String(error)
    })
}
}

// ...existing code...

const getAllOrders = async(req: Request, res: Response) => {
    const query = 'SELECT * FROM Orders';
    
    try {
        const result = await pool.query(query);
        
        if(result.rows.length === 0) {
            return res.status(404).json({
                message: 'No orders found'
            });
        }
        
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: result.rows
        });
    } catch(error) {
        res.status(500).json({
            message: "Error retrieving orders",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

// Update the exports
module.exports = {
    createOrder,
    getAllOrders
};