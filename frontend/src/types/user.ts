import { UserRole } from "./jwt";
import { TUmrahPackage } from "./umrah-package";

export type TUser = {
  id: string;
  name: string;
  email: string;
};

export type TUserWithDetail = TUser & {
  phone: string;
  role: UserRole;
  order_frequency: number;
  total_order_value: number;
  ordered_items: TUmrahPackage[];
};
