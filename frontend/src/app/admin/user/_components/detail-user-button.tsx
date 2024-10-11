"use client";
import { TUserWithDetail } from "~/types/user";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Button } from "~/app/_components/ui/button";
import { ScrollArea } from "~/app/_components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import Image from "next/image";
import toRupiah from "~/lib/rupiah";

const DetailUserButton = ({ user }: { user: TUserWithDetail }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="dataTable" onClick={() => setIsOpen(true)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-6 p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Order Frequency: {user.order_frequency}</p>
                <p>Total Order Value: {toRupiah(user.total_order_value)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ordered Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.ordered_items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={JSON.parse(item.photo_urls)[0]}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Grade: {item.grade.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ustadz: {item.ustadz.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailUserButton;
