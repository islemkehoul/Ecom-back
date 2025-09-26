import { body } from "express-validator";

export const orderValidationRules = () => {
  return [
    body('product_id')
      .notEmpty().withMessage('Product ID is required')
      .isLength({ max: 50 }).withMessage('Product ID must not exceed 50 characters')
      .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Product ID can only contain letters, numbers, hyphens, and underscores')
      .trim(),

    body('customer_name')
      .notEmpty().withMessage('Customer name is required')
      .isLength({ min: 3, max: 255 }).withMessage('Customer name must be 3-255 characters long')
      .matches(/^[a-zA-Z\s\u0600-\u06FF]+$/).withMessage('Customer name can only contain letters and spaces (Arabic/Latin)')
      .trim().escape(),

    body('customer_phone')
      .notEmpty().withMessage('Customer phone is required')
      .matches(/^(\+213|0)(5|6|7)[0-9]{8}$/)
      .withMessage('Phone must be Algerian and start with 05/06/07 or +2135/6/7'),

    body('customer_city')
      .notEmpty().withMessage('Customer city is required')
      .isLength({ min: 2, max: 100 }).withMessage('Customer city must be 2-100 characters long')
      .matches(/^[a-zA-Z\s\u0600-\u06FF-]+$/).withMessage('City name can only contain letters, spaces, and hyphens')
      .trim().escape(),

    body('customer_region')
      .notEmpty().withMessage('Customer region is required')
      .isLength({ min: 2, max: 100 }).withMessage('Customer region must be 2-100 characters long')
      .matches(/^[a-zA-Z\s\u0600-\u06FF-]+$/).withMessage('Region name can only contain letters, spaces, and hyphens')
      .trim().escape(),
  ];
};