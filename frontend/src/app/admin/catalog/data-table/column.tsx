"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TUmrahPackage } from "~/types/umrah-package";
import DeleteCatalogButton from "../_components/delete-catalog-button";

export const columns: ColumnDef<TUmrahPackage>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "grade.name",
    header: "Grade",
  },
  {
    accessorKey: "ustadz.name",
    header: "Ustadz",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell({ row }) {
      return (
        <div>
          {new Date(row.getValue("created_at")).toLocaleDateString("id-ID")}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Created At",
    cell({ row }) {
      return (
        <div>
          {new Date(row.getValue("updated_at")).toLocaleDateString("id-ID")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* <UpdateCatalogButton catalog={row.original} /> */}
          <DeleteCatalogButton catalog={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
];
