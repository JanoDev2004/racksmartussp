import express from "express";
import {
  reserveStock,
  releaseReserveStock,
  getReservedPackages,
  getReleasedPackages,
  getReservedPackageById,
} from "../controllers/reserveStock.controller.js";

const router = express.Router();

router.post("/", reserveStock);
router.post("/:id/release", releaseReserveStock);
router.get("/", getReservedPackages);
router.get("/released", getReleasedPackages);
router.get("/:id", getReservedPackageById);

export default router;