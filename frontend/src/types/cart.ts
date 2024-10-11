import { TUmrahPackage } from "./umrah-package";
import { TUser } from "./user";

export type TCart = {
  id: string;
  quantity: number;
  total_price: number;
  umrah_package: TUmrahPackage;
  user: TUser;
  created_at: string;
  updated_at: string;
};
