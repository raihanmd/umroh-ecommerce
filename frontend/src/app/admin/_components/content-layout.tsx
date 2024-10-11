"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "./navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs = [{ href: "/", label: "Home" }];

    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      breadcrumbs.push({
        href,
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <>
      <Navbar title={title} />
      <div className="min-h-[calc(100vh_-_112px)] w-full space-y-5 bg-background/95 px-4 pb-8 pt-8 sm:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.href}>
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {children}
      </div>
    </>
  );
}
