import UserLayout from "../_components/user-layout";
import CartPage from "./_components/cart-page";
import { userGetCart } from "~/_actions/cart";

export default async function page() {
  const carts = await userGetCart();

  return (
    <UserLayout>
      <CartPage carts={carts.payload} />
    </UserLayout>
  );
}
