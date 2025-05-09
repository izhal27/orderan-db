"use client";

import { Roles, type Customer } from "@/constants";
import { isContain } from "@/helpers";
import { Table } from "flowbite-react";
import type { Session } from "next-auth";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: Customer[];
  onEditHandler(id: string): void;
  onRemoveHandler(id: string): void;
  session: Session | null;
}

export default function CustomerTable({
  data,
  onEditHandler,
  onRemoveHandler,
  session,
}: props) {
  return (
    <div className="flex flex-col gap-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="text-center">Nama</Table.HeadCell>
          <Table.HeadCell className="text-center">Alamat</Table.HeadCell>
          <Table.HeadCell className="text-center">Kontak</Table.HeadCell>
          <Table.HeadCell className="text-center">Email</Table.HeadCell>
          <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data?.map((item: Customer) => {
            return (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>{item.contact}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-1">
                    <HiPencil
                      className="cursor-pointer text-blue-500"
                      onClick={() => onEditHandler(item.id)}
                    />
                    {(isContain(session?.user?.role || "", Roles.ADMIN) ||
                      isContain(
                        session?.user?.role || "",
                        Roles.ADMINISTRASI,
                      )) && (
                      <HiTrash
                        className="ml-2 cursor-pointer text-red-500"
                        onClick={() => onRemoveHandler(item.id)}
                      />
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
