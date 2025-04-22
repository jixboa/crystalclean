import connectMongo from "../../../database/conn";

export async function GET(request) {
  await connectMongo();
  return new Response("Hello World");
}
