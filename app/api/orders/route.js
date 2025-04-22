import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Order from "../../../models/orderSchema";
import Product from "../../../models/productSchema";

export async function POST(request) {
  await connectMongo();

  const productQuantity = {};
  const {
    name,
    contact,
    invoice_number,
    total_amount,
    amount_recieved,
    change,
    mode,
    status,
    selectedIds,
    created_by,
  } = await request.json();

  const productIds = selectedIds.split(",");
  const uniqIds = [...new Set(productIds)];
  const products = await Product.find({ _id: { $in: uniqIds } });

  let product_data = [];
  for (let productId of uniqIds) {
    const quantity = productIds.filter((id) => id === productId).length;
    const product = products.find((p) => p._id.toString() == productId);

    product_data.push({
      name: product.name,
      quantity: quantity,
      unit_amount: product.price,
    });
  }

  const order = await Order.create({
    products: product_data,
    name: name,
    contact: contact,
    invoice_number: invoice_number,
    payment_mode: mode,
    amount_recieved: amount_recieved,
    change: change,
    status: status,
    total_amount: total_amount,
    created_by: created_by,
  });

  productIds.forEach((id) => {
    productQuantity[id] = (productQuantity[id] || 0) + 1;
  });

  for (const id in productQuantity) {
    const count = productQuantity[id];
    const product = await Product.findOne({ _id: id });

    if (product) {
      // Convert the product_quantity to a number, decrement it, and then convert it back to a string
      const currentQuantity = parseInt(product.quantity, 10);
      product.quantity = (currentQuantity - count).toString();
      await product.save();
    }
  }
  //console.log(productQuantity);

  //response = await Order.create({ name });
  return NextResponse.json({ order });
}

export async function GET(request) {
  await connectMongo();
  const orders = await Order.find();
  return NextResponse.json({ orders });
}
