import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { TUmrahPackage } from "~/types/umrah-package";

type CatalogCardProps = {
  catalog: TUmrahPackage;
};

export default function CatalogCard({ catalog }: CatalogCardProps) {
  return (
    <Link href={`/${catalog.id}`}>
      <Card>
        <CardContent className="space-y-3 py-5">
          <Image
            src={JSON.parse(catalog.photo_urls)[0]}
            alt={catalog.name}
            width={200}
            height={200}
            className="aspect-square w-full rounded-lg object-cover object-center"
          />
          <div>
            <h3 className="line-clamp-1 text-xl font-bold">{catalog.name}</h3>
            <p className="line-clamp-1 text-muted-foreground">
              {catalog.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
