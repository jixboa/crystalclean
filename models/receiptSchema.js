import { Schema, model, models } from "mongoose";

const ReceiptSchema = new Schema({
  name: String,
  discription: String,
  price: Number,
  category: String,
  picture: String,
});

const Receipt = models?.Receipt || model("Receipt", ReceiptSchema);

export default Receipt;
