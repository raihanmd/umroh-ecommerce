import { TUmrahPackage } from "./umrah-package";

export type TOrder = {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: TUmrahPackage[];
};

export type TOrderItem = {
  id: string;
  total_price: number;
  quantity: number;
  umrah_package: TUmrahPackage;
};
