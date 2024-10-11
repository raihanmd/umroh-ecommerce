import Image from "next/image";
import Link from "next/link";
import { fetchInstance } from "~/lib/fetch";
import toRupiah from "~/lib/rupiah";
import { TUmrahPackage } from "~/types/umrah-package";
import AddToCart from "./_components/add-to-cart";

const getCatalogs = async (catalogId: string) => {
  return (await (await fetchInstance(`/umrah-packages/${catalogId}`)).json())
    .payload as TUmrahPackage;
};

export default async function page({
  params,
}: {
  params: { catalogId: string };
}) {
  const catalog = await getCatalogs(params.catalogId);
  const photoUrls = JSON.parse(catalog.photo_urls);
  const videoUrls = JSON.parse(catalog.video_urls);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-2 py-10 xl:px-0">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Image
          width={500}
          height={500}
          src={photoUrls[0]}
          alt={catalog.name}
          className="aspect-square h-full w-full rounded-lg object-cover object-center"
        />
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {photoUrls.slice(1).map((photoUrl: string) => (
            <Image
              width={500}
              height={500}
              key={photoUrl}
              src={photoUrl}
              alt={catalog.name}
              className="aspect-square h-full w-full rounded-lg object-cover object-center"
            />
          ))}
          {videoUrls.map((videoUrl: string) => (
            <video
              key={videoUrl}
              src={videoUrl}
              controls={true}
              className="aspect-square h-full w-full rounded-lg object-cover object-center"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap justify-between gap-3 rounded-lg border border-primary bg-primary/20 p-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/ustadz/${catalog.ustadz_id}`}
              className="text-xl font-bold text-foreground"
            >
              Bersama Ustadz {catalog.ustadz.name}
            </Link>
            <p className="text-chart-3">{toRupiah(catalog.price)}</p>
          </div>
          <AddToCart catalog={catalog} />
        </div>
        <h1 className="text-3xl font-bold text-primary">{catalog.name}</h1>
        <p className="text-foreground">{catalog.description}</p>
      </div>
    </div>
  );
}
