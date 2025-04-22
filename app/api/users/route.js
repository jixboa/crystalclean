import { NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import User from "../../../models/userSchema";

export async function GET(request) {
  await connectMongo();
  const users = await User.find();
  //console.log(users);
  return NextResponse.json({ users });
}
