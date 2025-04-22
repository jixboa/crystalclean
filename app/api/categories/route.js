import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Category from "../../../models/categorySchema";
import initMiddleware from "../../utils/cors";

export async function POST(request) {
  await connectMongo();
  //await initMiddleware(req, res);
  const { name } = await request.json();
  const response = await Category.create({ name });
  return NextResponse.json(response);
}

export async function GET(request) {
  await connectMongo();
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function DELETE(request) {
  await connectMongo();

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json("Id not Received");
  }
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Cat deleted" }, { status: 200 });
}
