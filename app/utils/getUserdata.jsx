import { parse } from "cookie"; // Import the 'cookie' library to parse cookies
//import jwt from "jsonwebtoken";

export function getUserData(req) {
  // Retrieve cookies from the request object
  const cookies = parse(req.headers.cookie || "");

  // Check if the 'token' cookie exists
  if (cookies.token) {
    // Verify and decode the token using your JWT secret key
    try {
      console.log(cookies);
      /* const tokenData = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      return tokenData; */
    } catch (error) {
      // Token verification failed
      return null;
    }
  } else {
    // 'token' cookie does not exist
    return null;
  }
}
