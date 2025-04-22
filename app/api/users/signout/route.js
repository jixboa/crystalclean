import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.headers.set("Cache-Control", "no-store");

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: -1,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
