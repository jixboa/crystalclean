import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getTokenData } from "./app/utils/getTokenData";

// This function can be marked `async` if using `await` inside
const secret = process.env.JWT_SECRET_KEY || "";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/users/signin";

  // Fetch the token data from the API route

  const token = request.cookies.get("token")?.value || "";
  //const user = await getTokenData(token);
/*   const tokenResponse = await fetch(`${process.env.DOMAIN}/api/users/me`); // Replace with your actual API route URL
  const tokenData = await tokenResponse.json(); */

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/users/signin", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/products",
    "/sales",
    "/orders",
    "/checkout",
    "/categories",
    "/users/signin",
    "/users/signup",
    "/orderDetails",
  ],
};
