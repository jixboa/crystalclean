// pages/api/getUserData.js
import { NextResponse } from "next/server";
import { getTokenData } from "../../../utils/getTokenData";
import { cookies } from "next/headers";

export async function GET(NextRequest) {
  const cookieStore = await cookies();
  let token = await cookieStore.get("token");

  if (token) {
    const userData = await getTokenData(token.value);
    return NextResponse.json(userData);
  }
  return NextResponse.json({ token: "" });
}
