import connectMongo from "../../../database/conn";

export async function GET(request) {
  await connectMongo();
  return new Response("Hello World");
}

/* export default function handler(req, res) {
  connectMongo();
  res.status(200).json({ name: "Kwame" });
} */
