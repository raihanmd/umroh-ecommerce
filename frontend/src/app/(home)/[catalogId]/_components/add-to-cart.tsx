"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createCart } from "~/_actions/cart";
import { Button } from "~/app/_components/ui/button";
import { TUmrahPackage } from "~/types/umrah-package";

type AddToCartProps = {
  catalog: TUmrahPackage;
};

export default function AddToCart({ catalog }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  const onCartClick = async () => {
    const res = await createCart({ umrah_package_id: catalog.id, quantity });

    console.log(toast);

    if (res.forbidden) {
      toast.error("Admin cant do this action");
    }

    if (res.mustLogin) {
      toast.error("Please login first");
      router.push("/login");
    }

    if (res.success) {
      toast.success("Add to cart successfully");
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center rounded-md border border-input bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={decrementQuantity}
          className="h-8 w-8 rounded-r-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={incrementQuantity}
          className="h-8 w-8 rounded-l-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="default"
        className="w-full md:w-52"
        onClick={onCartClick}
      >
        <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
      </Button>
    </div>
  );
}
