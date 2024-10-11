import { TUstadz } from "~/types/ustadz";
import { ContentLayout } from "../_components/content-layout";
import { DataTable } from "./data-table";
import { columns } from "./data-table/column";
import DashboardCard from "~/app/_components/ui/dashboard.cart";
import { fetchInstance } from "~/lib/fetch";
import { TUmrahPackage } from "~/types/umrah-package";
import { TGrade } from "~/types/grade";

const fetchCatalog = async () => {
  return (await (
    await fetchInstance("/umrah-packages", {
      next: { tags: ["catalogs"], revalidate: 10 },
    })
  ).json()) as {
    payload: TUmrahPackage[];
  };
};

const fetchUstadz = async () => {
  return (await (
    await fetchInstance("/ustadzs?limit=1000", {
      next: { tags: ["ustadzs"], revalidate: 10 },
    })
  ).json()) as {
    payload: TUstadz[];
  };
};

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
  const grades = await fetchCatalog();
  const ustadz = await fetchUstadz();
  const grade = await fetchGrade();

  return (
    <ContentLayout title="Catalogs">
      <DashboardCard>
        <DataTable
          columns={columns}
          data={grades.payload}
          grades={grade.payload}
          ustadzs={ustadz.payload}
        />
      </DashboardCard>
    </ContentLayout>
  );
}
