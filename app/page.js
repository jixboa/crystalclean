import Dashboard from "./components/dashboard";
import { GetCategories } from "./actions/categoryActions";
import { GetProducts } from "./actions/productActions";
import { GetOrders } from "./actions/orderActions";
import { GetCurrentUser } from "./actions/userActions";
import { redirect } from "next/navigation";

//export const runtime = "edge";

export default async function Home() {
  
  
/*   const categories = await GetCategories();
  const products = await GetProducts();
  const orders = await GetOrders();
  const currentUser = await GetCurrentUser();
 */
  const [categories, products, orders, currentUser] = 
  await Promise.all([GetCategories(), GetProducts(), GetOrders(), GetCurrentUser()])

  const currentTime = Math.floor(Date.now() / 1000);

  if (!currentUser?.userData?.isAdmin) {
    redirect("/sales");
  }

  return (
    <>
      <div className="mt-16 mb-20">
        <Dashboard
          categories={categories}
          products={products}
          orders={orders}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}
