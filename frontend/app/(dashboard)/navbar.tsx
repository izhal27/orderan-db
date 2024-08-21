import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import { useSidebarContext } from "@/context/SidebarContext";
import { isSmallScreen } from "@/helpers/is-small-screen";
import UserAvatar from "@/components/UserAvatar";

export const DashboardNavbar: FC<Record<string, never>> = function () {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useSidebarContext();
  const { data: session } = useSession();

  return (
    <header>
      <Navbar
        fluid
        className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0"
      >
        <div className="w-full p-3 pr-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                aria-controls="sidebar"
                aria-expanded
                className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed || !isSmallScreen() ? (
                  <HiMenuAlt1 className="size-6" />
                ) : (
                  <HiX className="size-6" />
                )}
              </button>
              <Navbar.Brand as={Link} href="/">
                <Image
                  alt="Dunia Baliho logo"
                  width="32"
                  height="32"
                  src="/favicon.png"
                />
                <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">
                  Dunia Baliho
                </span>
              </Navbar.Brand>
            </div>
            <div className="flex gap-x-5 md:order-2">
              <DarkThemeToggle />
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <UserAvatar
                    imageUrl={`http://localhost:3002/images/${session?.user.image}`}
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">@{session?.user.username}</span>
                  <span className="block truncate text-sm font-medium">
                    {session?.user.name}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => signOut({
                    callbackUrl: 'http://localhost:3000/auth/signin',
                    redirect: true
                  })}>
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  );
};
