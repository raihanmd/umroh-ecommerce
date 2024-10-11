"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TOrder, TOrderItem } from "~/types/order";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import toRupiah from "~/lib/rupiah";

type OrdersPageProps = {
  orders: TOrder[];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderItem: React.FC<{ item: TOrderItem }> = ({ item }) => (
  <div className="flex items-center space-x-4 border-t pt-4">
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
      <h3 className="text-lg font-semibold">{item.umrah_package.name}</h3>
      <p className="text-sm text-gray-500">
        Grade: {item.umrah_package.grade.name} | Ustadz:{" "}
        {item.umrah_package.ustadz.name}
      </p>
      <p className="text-sm">Quantity: {item.quantity}</p>
      <p className="font-medium">{toRupiah(item.total_price)}</p>
    </div>
  </div>
);

const OrderCard: React.FC<{
  order: TOrder;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ order, isExpanded, onToggle }) => (
  <Collapsible open={isExpanded} onOpenChange={onToggle}>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order #{order.id}</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatDate(order.created_at)}</span>
          <span className={`rounded-full bg-green-600 px-2 py-1 text-white`}>
            {order.status}
          </span>
        </div>
        <div className="text-lg font-semibold">
          Total: {toRupiah(order.total_price)}
        </div>
      </CardHeader>
      <CollapsibleContent>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              // @ts-ignore
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
);

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-xl font-semibold">No orders found</p>
            <p className="mt-1 text-gray-500">
              You haven't placed any orders yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isExpanded={expandedOrders.has(order.id)}
            onToggle={() => toggleOrderExpansion(order.id)}
          />
        ))
      )}
    </div>
  );
};

export default OrdersPage;
