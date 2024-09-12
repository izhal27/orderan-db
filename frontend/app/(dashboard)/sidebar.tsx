import UserAvatar from "@/components/UserAvatar";
import { useSidebarContext } from "@/context/SidebarContext";
import { Sidebar } from "flowbite-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BiMaleFemale,
  BiSolidReport,
  BiSolidShoppingBag,
  BiSolidUserAccount,
} from "react-icons/bi";
import { HiColorSwatch, HiDocumentText, HiFolder } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const orderUrls = [
  {
    url: "/orders/list",
    icon: HiDocumentText,
    text: "Daftar",
  },
  {
    url: "/orders/report",
    icon: BiSolidReport,
    text: "Laporan",
  },
];

const dataUrls = [
  {
    url: "/data/order-type",
    icon: HiColorSwatch,
    text: "Jenis Pesanan",
  },
  {
    url: "/data/customer",
    icon: BiMaleFemale,
    text: "Pelanggan",
  },
  {
    url: "/data/users",
    icon: BiSolidUserAccount,
    text: "Users",
  },
];

export const DashboardSidebar: NextPage = function () {
  const [isMounted, setIsMounted] = useState(false);
  const { isCollapsed } = useSidebarContext();
  const currentPath = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isCollapsed}
        id="sidebar"
        className={twMerge(
          "fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-gray-200 duration-75 dark:border-gray-700 lg:flex",
          isCollapsed && "hidden w-16",
        )}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div
              className={twMerge(
                "flex flex-col items-center space-y-2 p-4",
                isCollapsed && "hidden w-16",
              )}
            >
              <UserAvatar
                width={80}
                height={80}
                userImage={session?.user.image}
                size="lg"
                bordered
                rounded
              />
              <div className="w-full truncate text-center font-semibold dark:text-white">
                <div>{session?.user.name}</div>
                <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                  @{session?.user.username}
                </div>
              </div>
            </div>
            <Sidebar.Collapse
              icon={BiSolidShoppingBag}
              label="Pesanan"
              open={currentPath.includes("/orders")}
            >
              {orderUrls.map((item, i) => (
                <Sidebar.Item
                  key={i}
                  as={Link}
                  href={item.url}
                  icon={item.icon}
                  active={currentPath.includes(item.url)}
                >
                  {item.text}
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
            <Sidebar.Collapse
              icon={HiFolder}
              label="Data"
              open={currentPath.includes("/data")}
            >
              {dataUrls.map((item, i) => (
                <Sidebar.Item
                  key={i}
                  as={Link}
                  href={item.url}
                  icon={item.icon}
                  active={currentPath.includes(item.url)}
                >
                  {item.text}
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    )
  );
};
