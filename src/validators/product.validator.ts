import {body} from "express-validator";
export const productValidationRules = () => {
    return [
        body("id")
            .notEmpty().withMessage("Product ID is required")
            .isLength({ max: 50 }).withMessage("Product ID must not exceed 50 characters")
            .matches(/^[a-zA-Z0-9-_]+$/).withMessage("Product ID can only contain letters, numbers, hyphens, and underscores")
            .trim(),

        body("name")
            .notEmpty().withMessage("Product name is required")
            .isLength({ min: 3, max: 255 }).withMessage("Product name must be 3-255 characters")
            .trim().escape(),

        body("description")
            .optional()  // Make it optional to match your schema
            .isLength({ min: 10 }).withMessage("Product description must be at least 10 characters if provided")
            .trim().escape(),

        body("price")
            .notEmpty().withMessage("Product price is required")
            .isFloat({ gt: 0 }).withMessage("Product price must be a positive number")
            .custom((value) => {
                // Validate DECIMAL(10,2) format
                const decimalRegex = /^\d{1,8}(\.\d{1,2})?$/;
                if (!decimalRegex.test(value.toString())) {
                    throw new Error("Price must have at most 8 digits before decimal and 2 after");
                }
                return true;
            }),

        body("category")
            .optional()
            .isIn(['electronics', 'clothing', 'home_garden', 'books', 'sports'])
            .withMessage("Category must be one of: electronics, clothing, home_garden, books, sports"),

        body("image")
            .optional()
            .isLength({ max: 255 }).withMessage("Image filename too long")
            .matches(/\.(jpg|jpeg|png|gif|webp)$/i).withMessage("Image must be a valid image file")
    ];
};