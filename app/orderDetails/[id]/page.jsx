import OrderDetailsClient from "../../components/orderDetails";
import { GetCurrentUser } from "../../actions/userActions";

// export const runtime = "edge";

export default async function orderDetails() {
  const currentUser = await GetCurrentUser();
  console.log(currentUser);

  return <OrderDetailsClient currentUser={currentUser} />;
}
