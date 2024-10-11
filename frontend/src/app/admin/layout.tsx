import { PropsWithChildren } from "react";
import AdminPanelLayout from "./_components/admin-panel-layout";

export default function layout({ children }: PropsWithChildren) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
