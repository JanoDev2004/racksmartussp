import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      unique: true,
      trim: true,
    },

    itemDescription: {
      type: String,
      trim: true,
    },

    segment: {
      type: String,
      trim: true,
    },

    dimension: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    reservedQuantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    accountTo: {
      type: String,
      trim: true,
    },

    uom: {
      type: String, // Unit of Measure (pcs, box, kg, etc.)
      trim: true,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
