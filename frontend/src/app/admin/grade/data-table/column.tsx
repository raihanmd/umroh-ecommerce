"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TGrade } from "~/types/grade";
import DeleteGradeButton from "../_components/delete-grade-button";
import { UpdateGradeButton } from "../_components/update-grade-button";

export const columns: ColumnDef<TGrade>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <UpdateGradeButton grade={row.original} />
          <DeleteGradeButton grade={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
];
