import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verify } from "jsonwebtoken";

export const getTokenData = async (tokenString) => {
  const secret = process.env.JWT_SECRET_KEY || "";

  try {
    const userData = await verify(tokenString, secret);
    return userData;
  } catch (error) {
    return { error: "Not Authorized" };
  }
};
