'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "flowbite-react";
import { HiDocumentAdd } from "react-icons/hi";

export default function AddButton() {
  const currentPath = usePathname();

  return (
    <Button size={"sm"} color={"blue"} as={Link} href={`${currentPath}/add`}>
      <HiDocumentAdd className="mr-2 size-5" />
      Tambah
    </Button>
  )
}