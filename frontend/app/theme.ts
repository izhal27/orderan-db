import { type CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  footer: {
    root: {
      base: "flex flex-col",
    },
    brand: {
      base: "m-6 flex items-center",
    },
    groupLink: {
      base: "flex flex-col flex-wrap text-gray-500 dark:text-white",
      link: {
        base: "mb-4 last:mr-0 md:mr-6",
      },
    },
    icon: {
      base: "text-gray-400 hover:text-gray-900 dark:hover:text-white",
    },
  },
  modal: {
    body: {
      base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
    },
  },
  sidebar: {
    root: {
      base: "h-full bg-gray-50",
      inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800",
      collapsed: {
        on: "w-14",
        off: "w-52"
      },
    },
    collapse: {
      icon: {
        base: "h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        open: {
          off: "",
          on: "text-gray-900"
        }
      },
      list: "space-y-1 py-2 list-none",
      label: {
        base: "ml-2 flex-1 whitespace-nowrap text-left",
        icon: {
          base: "h-5 w-5 transition delay-0 ease-in-out",
          open: {
            on: "rotate-180",
            off: ""
          }
        }
      },
    },
    item: {
      base: "no-underline flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      icon: {
        base: "h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-gray-700 dark:text-gray-100"
      },
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-75",
        noIcon: "font-bold"
      },
    },
    itemGroup: {
      base: "list-none border-t border-gray-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
  },
  table: {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow-md dark:bg-black",
      wrapper: "relative"
    },
    body: {
      base: "group/body",
      cell: {
        base: "px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
      }
    },
    head: {
      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "bg-gray-50 px-4 py-2 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
      }
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped: "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
    }
  }
};
