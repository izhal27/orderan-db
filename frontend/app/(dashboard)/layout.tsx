"use client";

import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

const DashboardLayoutContent: FC<PropsWithChildren> = function ({ children }) {
  const { isCollapsed } = useSidebarContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <>
        <DashboardNavbar />
        <div className="mt-16 flex items-start">
          <DashboardSidebar />
          <div
            id="main-content"
            className={twMerge(
              "relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
              isCollapsed ? "lg:ml-[4rem]" : "lg:ml-52",
            )}
          >
            {children}
          </div>
        </div>
      </>
    )
  );
};

export default DashboardLayout;
