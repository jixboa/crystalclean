import connectMongo from "../../../database/conn";
import Product from "../../../models/productSchema";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  await connectMongo();

  const ids = request.nextUrl.searchParams.get("ids");
  if (ids) {
    const idArray = ids.split(",");
    const products = await Product.find({ _id: { $in: idArray } });
    return NextResponse.json({ products });
  } else {
    return NextResponse.json({ products: [] });
  }
}
