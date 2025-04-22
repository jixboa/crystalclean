import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: String,
  description: String,
  price: String,
  size: { type: String, default: "normal" },
  quantity: String,
  category: String,
  status: String,
  picture: { type: String, default: "/images/default.png" },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = models?.Product || model("Product", ProductSchema);

export default Product;
