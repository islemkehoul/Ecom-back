import { Request, Response } from "express";
import pool from "../db/db";
import { validationResult } from "express-validator";

 const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM Products');
    res.status(200).json({
      message: "Database connection successful",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      message: "Error connecting to database",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

 const getProductById = async (req:Request, res:Response)=>{
    const {id} = req.params;
    console.log(id);
    const query = 'SELECT * FROM Products WHERE id = $1';
    try 
    {
      const result = await pool.query(query,[id]);
      if (result.rowCount === 0 )
      res.status(404).json({
        message: 'Product not found'
      });
      res.json({
      product : result.rows[0]      
      })
    }
    catch(error)
    {
      res.status(500).json({
        message : "Error fetching product"
      });
    }
}

 const createProduct = async (req:Request,res:Response) =>{
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id,name, price, description, category } = req.body;
  const image = req.file ? req.file.filename : null;
  const query = 'INSERT INTO Products (id,name, price, description, category, image) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *';
  try{
    const result = await pool.query(query, [id,name, price, description, category, image]);
    if (result.rows.length === 0) {
      return res.status(500).json({ message: 'Failed to create product' });
    }
    res.status(201).json({ message:"Product created successfully", product: result.rows[0]});
  }
  catch(error)
  {
    res.status(500).json({
      message:"Error creating product",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
 const deleteProduct = async ( req:Request, res:Response) =>{
 const { id} = req.params;
 const query = 'DELETE FROM Products WHERE id = $1 RETURNING *';
 try {
    const result = await pool.query(query, [id]);
    if (result.rows.length ===0)
    {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully', product: result.rows[0] });
 }
 catch(error)
 {
    res.status(500).json({
      message: "Error deleting product",
      error: error instanceof Error ? error.message : String(error)
    });
 }

}
const updateProduct = async (req:Request, res:Response) => {
 const { id } = req.params;
 const { name, price, description, category } = req.body;
  const image = req.file?.filename ;
  const fields : string[] = [];
  const values : any[] = [];
  let idx = 1;
  if (name !== undefined)
  {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }
   if (price !== undefined) {
    fields.push(`price = $${idx++}`);
    values.push(price);
  }
  if (description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }
  if (category !== undefined) {
    fields.push(`category = $${idx++}`);
    values.push(category);
  }
  if (image !== undefined) {
    fields.push(`image = $${idx++}`);
    values.push(image);
  }
  

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  values.push(id);
  const query = `UPDATE Products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  try{
  const result = await pool.query(query,values);
  if (result.rows.length === 0)
  {
    res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json({message : 'Product updated successfully', product : `${result.rows[0]}`});
  }
  catch(error){
    res.status(500).json({
      message: "Error updating product",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}


module.exports = { getAllProducts, getProductById, createProduct, deleteProduct, updateProduct }
