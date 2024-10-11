import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { Badge } from "./ui/badge";
import { userGetCart } from "~/_actions/cart";
import Link from "next/link";

export default async function CartButton() {
  const carts = await userGetCart();

  const displayCount =
    carts.payload.length > 99 ? "99+" : Math.min(carts.payload.length, 99);

  return (
    <Link href={"/user/cart"}>
      <Button variant="outline" className="relative px-3">
        <ShoppingBag className="size-4" />
        {carts.payload.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -left-2 -top-2 inline-flex size-5 w-fit min-w-5 items-center justify-center rounded-full border-2 p-1 text-xs font-bold"
          >
            {displayCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
