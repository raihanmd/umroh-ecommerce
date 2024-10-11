import { ContentLayout } from "../_components/content-layout";
import { DataTable } from "./data-table";
import { columns } from "./data-table/column";
import DashboardCard from "~/app/_components/ui/dashboard.cart";
import { adminGetUser } from "~/_actions/user";

export default async function page() {
  const users = await adminGetUser();

  return (
    <ContentLayout title="Grade">
      <DashboardCard>
        <DataTable columns={columns} data={users.payload} />
      </DashboardCard>
    </ContentLayout>
  );
}
