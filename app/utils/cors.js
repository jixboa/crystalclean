// lib/cors.js
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  methods: ["GET", "POST"], // Specify allowed HTTP methods
  origin: "*", // Set the allowed origin dynamically
});

export default function initMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
