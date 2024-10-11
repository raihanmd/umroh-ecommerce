import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type DashboardCardProps = {
  title?: string;
  children: ReactNode;
  right?: ReactNode;
};

export default function DashboardCard({ ...props }: DashboardCardProps) {
  return (
    <Card>
      {props.title && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
          {props.right}
        </CardHeader>
      )}
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}
