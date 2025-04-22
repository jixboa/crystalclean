import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";
import Product from "../../../../models/productSchema";

export async function PUT(request, { params }) {
  await connectMongo();

  const { id } = params;
  const {
    newName: name,
    newDescription: description,
    newCategory: category,
    newPrice: price,
    newSize: size,
    newQuantity: quantity,
    newStatus: status,
  } = await request.json();

  await Product.findByIdAndUpdate(id, {
    name,
    description,
    category,
    price,
    quantity,
    size,
    status,
  });
  return NextResponse.json(
    { message: "Product updated successfully" },
    { status: 200 }
  );
}

/* export async function GET(request, { params }) {
  await connectMongo;
  const { id } = params;
  const prod = await Product.findOne({ _id: id });
  return NextResponse.json({ prod }, { status: 200 });
}
 */

/* export async function GET(request, { params }) {
  await connectMongo;
  const { id } = params;
  const idArray = id.split(",");
  try {
    const products = await Product.find({ _id: { $in: idArray } });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" });
  }
}
 */
