// export const runtime = "edge";
import ProductClient from "../components/productsClient";

import { CategoryClient } from "../components/categories";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

import { GetProducts } from "app/actions/productActions";
import { GetCurrentUser } from "app/actions/userActions";

const getProducts = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading products");
    }

    return res.json();
  } catch (error) {
    console.log("error Loading products", error);
  }
};

export default async function Products() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["products"], getProducts);
  const dehydratedState = dehydrate(queryClient);
  //const currentUser = await GetCurrentUser();

  const [products,  currentUser] = 
  await Promise.all([GetProducts(), GetCurrentUser()])

  if (!currentUser?.userData?.isAdmin) {
    redirect("/users/signin");
  }

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div>
          <ProductClient products={products} currentUser={currentUser} />
        </div>
      </Hydrate>
    </>
  );
}
