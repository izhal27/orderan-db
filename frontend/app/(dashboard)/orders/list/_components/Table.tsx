"use client";

import { Table } from "flowbite-react";
import { HiDocumentSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Order } from "@/constants";

interface props {
  data: Order[];
  onEditHandler(id: string): void;
  onRemoveHandler(id: string): void;
}

export default function OrderTable({
  data,
  onEditHandler,
  onRemoveHandler,
}: props) {
  return (
    <div className="flex flex-col gap-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="text-center">User</Table.HeadCell>
          <Table.HeadCell className="text-center">Nomor</Table.HeadCell>
          <Table.HeadCell className="text-center">Tanggal</Table.HeadCell>
          <Table.HeadCell className="text-center">Pelanggan</Table.HeadCell>
          <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
          <Table.HeadCell className="text-center">Status</Table.HeadCell>
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data?.map((item: Order) => {
            return (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{item.user?.name}</Table.Cell>
                <Table.Cell>{item.number}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    <HiDocumentSearch
                      className="cursor-pointer text-blue-500"
                      onClick={() => onEditHandler(item.id)}
                    />
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
