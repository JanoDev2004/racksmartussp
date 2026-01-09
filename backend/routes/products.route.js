import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsForDropdown,
} from "../controllers/products.controller.js";

const router = express.Router();

// ✅ SPECIAL ROUTES FIRST
router.get("/dropdown", getProductsForDropdown);

// ✅ CRUD ROUTES
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
