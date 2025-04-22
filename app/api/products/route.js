import connectMongo from "../../../database/conn";
import Product from "../../../models/productSchema";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request) {
  const { name, description, category, price, quantity, size, status } =
    await request.json();
  await connectMongo();
  const response = await Product.create({
    name,
    description,
    category,
    price,
    quantity,
    size,
    status,
  });
  console.log(description, status);
  return NextResponse.json(response);
}

export async function GET(request) {
  await connectMongo();
  const products = await Product.find();
  return NextResponse.json({ products });
}

export async function DELETE(request) {
  await connectMongo();
  const id = request.nextUrl.searchParams.get("id");
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" }, { status: 200 });
}
