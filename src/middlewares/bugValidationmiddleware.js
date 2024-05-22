// Importing required libraries and variables
import { body, validationResult } from "express-validator";

// Define the validateBug middleware
const validateBugRequest = async (req, res, next) => {
  try {
    //validation rules here
    console.log(req.body);
    const rules = [
      body("title")
        .isLength({ min: 3, max: 15 })
        .withMessage("Title must be between 3 and 20 characters !"),
      ,
      body("description")
        .isLength({ min: 3, max: 15 })
        .withMessage("Description must be between 3 and 15 characters !"),
      ,
      body("author")
        .isLength({ min: 3, max: 15 })
        .withMessage("Author must be between 3 and 20 characters !"),
      body("labels"),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors
        .array()
        .map((error) => ({ [error.path]: error.msg }));
      return res.status(400).json({ errors });
    }

    // If validation passes, call the next middleware
    next();
  } catch (error) {
    // Pass any errors to the next middleware for proper error handling
    throw new Error();
  }
};

export default validateBugRequest;
