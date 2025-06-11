"use client"
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/dashboard/shared/Breadcrumb';
import { usePathname } from "next/navigation";

export default function DashboardBreadcrumb() {
  const pathname = usePathname()
  const routes = pathname
  .split('/')
  .filter((route) => route !== '')
  .map((route, index, array) => {
    const fullRoute = '/' + array.slice(0, index + 1).join('/');
    const routeName = route.charAt(0).toUpperCase() + route.slice(1);
    return {
      fullRoute,
      route: routeName,
    };
  });
  console.log(routes)
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {routes.map((route) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={route.fullRoute}>
                  {route.route}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {route !== routes[routes.length - 1] && (
              <BreadcrumbSeparator />
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}