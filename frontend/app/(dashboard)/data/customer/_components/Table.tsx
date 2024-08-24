"use client";

import type { Customer } from "@/constants";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: Customer[];
  onEditHandler(id: string): void;
  onRemoveHandler(id: string): void;
}

export default function CustomerTable({
  data,
  onEditHandler,
  onRemoveHandler,
}: props) {
  return (
    <div className="flex flex-col gap-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nama</Table.HeadCell>
          <Table.HeadCell>Alamat</Table.HeadCell>
          <Table.HeadCell>Kontak</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Keterangan</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
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
                  <div className="flex gap-1">
                    <HiPencil
                      className="cursor-pointer text-blue-500"
                      onClick={() => onEditHandler(item.id)}
                    />
                    <HiTrash
                      className="ml-2 cursor-pointer text-red-500"
                      onClick={() => onRemoveHandler(item.id)}
                    />
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
