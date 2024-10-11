import Link from "next/link";
import { NAV_MENU } from "~/const/navbar";
import { getSession } from "~/lib/jwt";
import { UserRole } from "~/types/jwt";
import CartButton from "./cart-button";

export default async function Navbar() {
  const user = await getSession();
  const role = user?.role;

  return (
    <div className="flex h-20 items-center justify-center border border-b-foreground bg-background px-2 py-4 xl:px-0">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Umroh</h1>
          <div className="flex items-center justify-center gap-2">
            {NAV_MENU.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-2 py-1 text-foreground"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                {role === UserRole.ADMIN && (
                  <Link
                    href="/admin/grade"
                    className="rounded-md px-2 py-1 text-foreground"
                  >
                    Dashboard
                  </Link>
                )}
                {role === UserRole.MEMBER && <CartButton />}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-2 py-1 text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md px-2 py-1 text-foreground"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
