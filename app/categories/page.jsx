import { get } from "mongoose";
import { CategoryClient } from "../components/categories";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { GetCategories } from "app/actions/categoryActions";
import { GetCurrentUser } from "app/actions/userActions";
import { redirect } from "next/navigation";

// export const runtime = "edge";
//export const dynamic = "dynamic-force"

export default async function Categories() {
  const data = await GetCategories();
  const currentUser = await GetCurrentUser();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["categories"], GetCategories);
  const dehydratedState = dehydrate(queryClient);

  if (!currentUser?.userData?.isAdmin) {
    redirect("/users/signin");
  }

  return (
    <>
      {
        <Hydrate state={dehydratedState}>
          <div>
            <CategoryClient data={data} currentUser={currentUser} />
          </div>
        </Hydrate>
      }
    </>
  );
}
