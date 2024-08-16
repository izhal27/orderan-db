
"use client";

import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

export function JenisPesananTable() {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nama</Table.HeadCell>
          <Table.HeadCell>Keterangan</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Apple MacBook Pro 17"'}
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>
              <div className="flex gap-x-1">
                <HiPencil
                  className="text-blue-500 cursor-pointer"
                  onClick={() => console.log('Item 1')}
                />
                <HiTrash
                  className="text-red-500 cursor-pointer ml-2"
                  onClick={() => console.log('Item 1')}
                />
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'ASUS TUF Gaming A14 (2024)'}
            </Table.Cell>
            <Table.Cell>Sliver</Table.Cell>
            <Table.Cell>
              <div className="flex gap-x-1">
                <HiPencil
                  className="text-blue-500 cursor-pointer"
                  onClick={() => console.log('Item 1')}
                />
                <HiTrash
                  className="text-red-500 cursor-pointer ml-2"
                  onClick={() => console.log('Item 1')}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}
