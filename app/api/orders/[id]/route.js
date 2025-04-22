import Order from "../../../../models/orderSchema";
import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";
import Product from "models/productSchema";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const order = await Order.findOne({ _id: id });
  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { newStatus: status } = await request.json();
  console.log(status);
  await connectMongo();
  await Order.findByIdAndUpdate(id, { status });

  if (status !== "paid") {
    const order = await Order.findById(id);

    for (const product of order.products) {
      const productObj = await Product.findOne({ name: product.name });

      if (productObj) {
        // Increase the product quantity
        productObj.quantity = (
          parseInt(productObj.quantity, 10) + parseInt(product.quantity, 10)
        ).toString();
        await productObj.save();
      }
    }
  }

  return NextResponse.json({ message: "Order Updated" }, { status: 200 });
}
