"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosAdd } from "react-icons/io";

interface props {
  text?: string;
}

export default function AddButton({ text = "Tambah" }: props) {
  const currentPath = usePathname();

  return (
    <Button size={"sm"} color={"blue"} as={Link} href={`${currentPath}/add`}>
      <IoIosAdd className="mr-2 size-5" />
      {text}
    </Button>
  );
}
