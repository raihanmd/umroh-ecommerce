"use client";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { TCart } from "~/types/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteCart, updateCart } from "~/_actions/cart";
import { toast } from "sonner";
import { checkout } from "~/_actions/checkout";
import toRupiah from "~/lib/rupiah";

type CartPageProps = {
  carts: TCart[];
};

export default function CartPage({ carts }: CartPageProps) {
  const [cartItems, setCartItems] = useState<TCart[]>(carts);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  const handleQuantityChange = async (
    cartId: string,
    umrah_package_id: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    try {
      const result = await updateCart({
        umrah_package_id,
        quantity: newQuantity,
      });
      if (!result.success) throw new Error("Failed to update quantity");

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartId
            ? {
                ...item,
                quantity: newQuantity,
                total_price: item.umrah_package.price * newQuantity,
              }
            : item,
        ),
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartId: string, umrah_package_id: string) => {
    try {
      const result = await deleteCart(umrah_package_id);

      if (!result.success) throw new Error("Failed to remove item");

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartId),
      );
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== cartId),
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const totalSelectedPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.total_price, 0);

  const handleCheckout = async () => {
    try {
      const res = await checkout(selectedItems);

      if (!res.success) throw new Error("Failed to checkout");

      toast.success("Checkout successfully");
      router.push("/user/order");
    } catch (error) {
      toast.error("Failed to checkout");
    }
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Your cart is empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding some items to your cart!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center">
            <Checkbox
              id="select-all"
              checked={selectedItems.length === cartItems.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="ml-2 text-sm font-medium">
              Select All
            </label>
          </div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <Checkbox
                  id={`select-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
                <div className="flex-shrink-0">
                  <Image
                    src={JSON.parse(item.umrah_package.photo_urls)[0]}
                    alt={item.umrah_package.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    {item.umrah_package.name}
                  </h3>
                  <p className="font-medium">
                    {toRupiah(item.umrah_package.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        item.umrah_package.id,
                        item.quantity - 1,
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        item.umrah_package.id,
                        item.quantity + 1,
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    handleRemoveItem(item.id, item.umrah_package.id)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                Total: {toRupiah(totalSelectedPrice)}
              </p>
              <p className="text-sm text-gray-500">
                {selectedItems.length} item(s) selected
              </p>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </>
  );
}
