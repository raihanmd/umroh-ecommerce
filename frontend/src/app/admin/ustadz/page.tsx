import { ContentLayout } from "../_components/content-layout";
import { DataTable } from "./data-table";
import { columns } from "./data-table/column";
import DashboardCard from "~/app/_components/ui/dashboard.cart";
import { fetchInstance } from "~/lib/fetch";
import { TUstadz } from "~/types/ustadz";

const fetchUstadz = async () => {
  return (await (
    await fetchInstance("/ustadzs", {
      next: { tags: ["ustadzs"], revalidate: 10 },
    })
  ).json()) as {
    payload: TUstadz[];
  };
};

export default async function page() {
  const ustadz = await fetchUstadz();

  return (
    <ContentLayout title="Grade">
      <DashboardCard>
        <DataTable columns={columns} data={ustadz.payload} />
      </DashboardCard>
    </ContentLayout>
  );
}
