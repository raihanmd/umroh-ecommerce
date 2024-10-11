import { fetchInstance } from "~/lib/fetch";
import Header from "../_components/header";
import { TUmrahPackage } from "~/types/umrah-package";
import { TMeta } from "~/types/meta";
import { Input } from "../_components/ui/input";
import CatalogCard from "../_components/catalog-card";

const getCatalogs = async (query?: string) => {
  const searchParams = query
    ? new URLSearchParams({ name: query }).toString()
    : "";

  return (await (
    await fetchInstance(
      `/umrah-packages${searchParams ? `?${searchParams}` : ""}`,
      {
        next: { tags: ["catalogs"], revalidate: 10 },
      },
    )
  ).json()) as {
    payload: TUmrahPackage[];
    meta: TMeta;
  };
};

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const catalogs = await getCatalogs(searchParams.query);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <form className="mx-auto lg:w-1/2">
          <Input
            name="query"
            placeholder="Search something"
            defaultValue={searchParams.query || ""}
          />
        </form>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catalogs.payload.length < 1 ? (
            <div className="col-span-4 w-full rounded-lg border py-20 text-center">
              No catalogs found
            </div>
          ) : (
            catalogs.payload.map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
