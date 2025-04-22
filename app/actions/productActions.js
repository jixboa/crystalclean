// Your Server Action file
"use server";

import { revalidatePath } from "next/cache";
import connectMongo from "../../database/conn";
import Product from "../../models/productSchema";

export async function AddCategory(data) {
  await connectMongo();

  try {
    let name = data.get("name")?.valueOf();
    const saveCategory = new Product({ name });

    const newCategory = await saveCategory.save();

    const simplifiedCategory = JSON.parse(JSON.stringify(newCategory));

    return simplifiedCategory;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  } finally {
    revalidatePath("/categories");
  }
}

// Server
export async function GetProducts() {
  await connectMongo();
  try {
    const products = await Product.find({});

    const serialisedProducts = products.map((product) => {
      return { ...product._doc, _id: product._id.toString() };
    });
    //console.log(serialisedCategory);

    // Convert the array of objects to plain JavaScript objects
    /*  const simplifiedCategories = categories.map((product) =>
      JSON.parse(JSON.stringify(product))
    ); */
    return serialisedProducts;
  } catch (error) {
    console.error("Error retrieving categories:", error);
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
    await Product.findByIdAndDelete(id);
    revalidatePath("/categories");
  } catch (error) {
    console.log(error);
  }
  /*  return NextResponse.json({ message: "Cat deleted" }, { status: 200 }); */
}

export async function UpdateCategory(editCat) {
  const id = editCat.id;
  const name = editCat.name;
  await connectMongo();

  await Product.findByIdAndUpdate(id, { name });
  revalidatePath("/categories");
}
