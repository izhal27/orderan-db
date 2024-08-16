import { Flowbite, ThemeModeScript } from "flowbite-react";
import { Inter } from "next/font/google";
import { type FC, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { flowbiteTheme } from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Orderan Dunia Baliho',
  description: 'Sistem orderan dunia baliho',
  author: 'Risal Walangadi',
  authors: [
    { name: 'Risal Walangadi', url: 'https://github.com/izhal27' }
  ],
  icons: {
    icon: '/favicon.png'
  }
}

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={twMerge("bg-gray-50 dark:bg-gray-900", inter.className)}>
        <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>
      </body>
    </html>
  );
};

export default RootLayout;
