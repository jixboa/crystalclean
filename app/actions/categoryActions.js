// Your Server Action file
"use server";

import { revalidatePath } from "next/cache";
import connectMongo from "../../database/conn";
import Category from "../../models/categorySchema";

import { cookies } from "next/headers";
import { getTokenData } from "app/utils/getTokenData";

export async function AddCategory(data) {
  const cookieStore = cookies();
  const token = await cookieStore.get("token");
  const userData = await getTokenData(token.value);

  if (!userData.isAdmin) {
    return { error: "Not Authorized" };
  }

  await connectMongo();

  try {
    let name = data.name;
    let active = data.active;

    const cat = await Category.findOne({ name });

    if (cat) {
      console.log("cat exist");
      return { error: "Category already exist" };
    }

    const saveCategory = new Category({ name, active });
    const newCategory = await saveCategory.save();

    const simplifiedCategory = JSON.parse(JSON.stringify(newCategory));

    return { simplifiedCategory, message: "Added successfully" };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  } finally {
    revalidatePath("/categories");
  }
}

// Server
export async function GetCategories() {
  await connectMongo();
  try {
    const categories = await Category.find({});

    const serialisedCategory = categories.map((category) => {
      return { ...category._doc, _id: category._id.toString() };
    });
    //console.log(serialisedCategory);

    // Convert the array of objects to plain JavaScript objects
    /*  const simplifiedCategories = categories.map((category) =>
      JSON.parse(JSON.stringify(category))
    ); */
    return serialisedCategory;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

export async function DeleteCategory(ID) {
  await connectMongo();

  const id = ID;
  if (!id) {
    return { message: "An Eror occured" };
  }

  try {
    await Category.findByIdAndDelete(id);
    revalidatePath("/categories");
  } catch (error) {
    console.log(error);
  }
  /*  return NextResponse.json({ message: "Cat deleted" }, { status: 200 }); */
}

export async function UpdateCategory(editCat) {
  const id = editCat?.id;
  const name = editCat?.name;
  await connectMongo();

  const cat = await Category.findOne({ name });

  if (cat) {
    //console.log("cat exists");
    return { error: "Category already exist" };
  } else {
    await Category.findByIdAndUpdate(id, { name });
    revalidatePath("/categories");
    return { message: "Category Updated" };
  }
}
