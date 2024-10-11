"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UpdateUstadzButton } from "../_components/update-ustadz-button";
import DeleteUstadzButton from "../_components/delete-ustadz-button";
import { TUstadz } from "~/types/ustadz";

export const columns: ColumnDef<TUstadz>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
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
          <UpdateUstadzButton ustadz={row.original} />
          <DeleteUstadzButton ustadz={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
];
