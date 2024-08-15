import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSidebarContext } from "@/context/SidebarContext";
import { Avatar, Sidebar } from "flowbite-react";
import { BiMaleFemale, BiSolidReport, BiSolidShoppingBag, BiSolidUserAccount } from "react-icons/bi";
import {
  HiColorSwatch,
  HiDocumentText,
  HiFolder,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export const DashboardSidebar: NextPage = function () {
  const [isMounted, setIsMounted] = useState(false);
  const { isCollapsed } = useSidebarContext();

  useEffect(() => {
    setIsMounted(true);
  }, [])

  return (
    isMounted && <Sidebar
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
          <div className={twMerge("flex flex-col items-center space-y-2 p-4", isCollapsed && "hidden w-16")}>
            <Avatar alt="avatar of Jese" rounded size='xl' />
            <div className="font-medium dark:text-white">
              <div className="text-sm text-gray-500 dark:text-gray-400">@username</div>
              <div>John Doe</div>
            </div>
          </div>
          <Sidebar.Collapse icon={BiSolidShoppingBag} label="Pesanan">
            <Sidebar.Item as={Link} href="#" icon={HiDocumentText}>Daftar</Sidebar.Item>
            <Sidebar.Item as={Link} href="#" icon={BiSolidReport}>Laporan</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiFolder} label="Data">
            <Sidebar.Item as={Link} href="#" icon={HiColorSwatch}>Jenis Pesanan</Sidebar.Item>
            <Sidebar.Item as={Link} href="#" icon={BiMaleFemale}>Pelanggan</Sidebar.Item>
            <Sidebar.Item as={Link} href="#" icon={BiSolidUserAccount}>Users</Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
