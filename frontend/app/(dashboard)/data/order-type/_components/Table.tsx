"use client";

import type { OrderType } from "@/constants";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: OrderType[];
  onEditHandler(id: number): void;
  onRemoveHandler(id: number): void;
}

export function OrderTypeTable({
  data,
  onEditHandler,
  onRemoveHandler,
}: props) {
  return (
    <div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="text-center">Nama</Table.HeadCell>
          <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data?.map((item: OrderType) => {
            return (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </Table.Cell>
                <Table.Cell className="inline-block">
                  {item.description}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-1">
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
