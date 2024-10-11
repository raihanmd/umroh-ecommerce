import { userGetOrder } from "~/_actions/order";
import OrdersPage from "./_components/order-package";
import UserLayout from "../_components/user-layout";

export default async function page() {
  const orders = await userGetOrder();

  return (
    <UserLayout>
      <OrdersPage orders={orders.payload} />
    </UserLayout>
  );
}
