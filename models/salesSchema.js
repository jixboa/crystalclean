import { Schema, model, models } from "mongoose";

const SalesSchema = new Schema({
  name: String,
  discription: String,
  price: Number,
  category: String,
  picture: String,
});

const Sales = models?.Sales || model("Sales", SalesSchema);

export default Sales;
