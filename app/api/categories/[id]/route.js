import Category from "../../../../models/categorySchema";
import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newName: name } = await request.json();
  await connectMongo();

  await Category.findByIdAndUpdate(id, { name });
  return NextResponse.json({ message: "Category Updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const category = await Category.findOne({ _id: id });
  return NextResponse.json({ category }, { status: 200 });
}
