import { Tag, Bookmark, LucideIcon, User, PersonStanding } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getAdminDashboardMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/admin/grade",
          label: "Grade",
          active: pathname.includes("/admin/grade"),
          icon: Bookmark,
        },
        {
          href: "/admin/ustadz",
          label: "Ustadz",
          active: pathname.includes("/admin/ustadz"),
          icon: User,
        },
        {
          href: "/admin/catalog",
          label: "Catalog",
          active: pathname.includes("/admin/catalog"),
          icon: Tag,
        },
        {
          href: "/admin/user",
          label: "User",
          active: pathname.includes("/admin/user"),
          icon: PersonStanding,
        },
      ],
    },
  ];
}
