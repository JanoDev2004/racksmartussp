import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsForDropdown,
} from "../controllers/products.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ SPECIAL ROUTES FIRST
router.get("/dropdown", getProductsForDropdown);

// ✅ CRUD ROUTES
router.post("/", protectRoute, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protectRoute, updateProduct);
router.delete("/:id", protectRoute, deleteProduct);

export default router;
