import { ContentLayout } from "../_components/content-layout";
import { DataTable } from "./data-table";
import { columns } from "./data-table/column";
import { TGrade } from "~/types/grade";
import DashboardCard from "~/app/_components/ui/dashboard.cart";
import { fetchInstance } from "~/lib/fetch";

const fetchGrade = async () => {
  return (await (
    await fetchInstance("/grades", {
      next: { tags: ["grades"], revalidate: 10 },
    })
  ).json()) as {
    payload: TGrade[];
  };
};

export default async function page() {
  const grades = await fetchGrade();

  return (
    <ContentLayout title="Grade">
      <DashboardCard>
        <DataTable columns={columns} data={grades.payload} />
      </DashboardCard>
    </ContentLayout>
  );
}
