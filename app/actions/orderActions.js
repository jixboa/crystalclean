// Your Server Action file
"use server";

import { revalidatePath } from "next/cache";
import connectMongo from "../../database/conn";
import Order from "../../models/orderSchema";

export async function AddCategory(data) {
  await connectMongo();

  try {
    let name = data.get("name")?.valueOf();
    const saveOrder = new Order({ name });

    const newOrder = await saveOrder.save();

    const simplifiedOrders = JSON.parse(JSON.stringify(newOrder));

    return simplifiedOrders;
  } catch (error) {
    console.error("Error creating Order:", error);
    throw error;
  } finally {
    revalidatePath("/orders");
  }
}

export async function GetOrders() {
  await connectMongo();
  try {
    const orders = await Order.find({});

    const serialisedOrders = orders.map((order) => {
      return { ...order._doc, _id: order._id.toString() };
    });
    //console.log(serialisedCategory);

    // Convert the array of objects to plain JavaScript objects
    /*  const simplifiedCategories = orders.map((product) =>
      JSON.parse(JSON.stringify(product))
    ); */
    return serialisedOrders;
  } catch (error) {
    console.error("Error retrieving orders:", error);
    throw error;
  }
}

export async function DeleteCategory(ID) {
  await connectMongo();

  const id = ID;
  if (!id) {
    return NextResponse.json("Id not Received");
  }

  try {
    await Order.findByIdAndDelete(id);
    revalidatePath("/orders");
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
  /*  return NextResponse.json({ message: "Cat deleted" }, { status: 200 }); */
}

export async function UpdateCategory(editCat) {
  const id = editCat.id;
  const name = editCat.name;
  await connectMongo();

  await Order.findByIdAndUpdate(id, { name });
  revalidatePath("/orders");
  revalidatePath("/");
}
