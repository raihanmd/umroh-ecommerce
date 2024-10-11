"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TUserWithDetail } from "~/types/user";
import DetailUserButton from "../_components/detail-user-button";

export const columns: ColumnDef<TUserWithDetail>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DetailUserButton user={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
];
