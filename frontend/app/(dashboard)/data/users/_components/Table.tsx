"use client";

import type { User } from "@/constants/interfaces";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: User[];
  onEditHandler(id: string): void;
  onRemoveHandler(id: string): void;
}

export function UsersTable({ data, onEditHandler, onRemoveHandler }: props) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell className="text-center">Username</Table.HeadCell>
        <Table.HeadCell className="text-center">Email</Table.HeadCell>
        <Table.HeadCell className="text-center">Nama</Table.HeadCell>
        <Table.HeadCell className="text-center">Blocked</Table.HeadCell>
        <Table.HeadCell className="text-center">Role</Table.HeadCell>
        <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {data?.map((item: User) => {
          return (
            <Table.Row
              key={item.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="font-medium text-gray-900 dark:text-white">
                {item.username}
              </Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell className="text-center">{item.blocked ? "Ya" : "Tidak"}</Table.Cell>
              <Table.Cell>{item.role && item.role.name}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-1 justify-center">
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
  );
}
