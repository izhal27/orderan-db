"use client";

import { Table } from "flowbite-react";
import { HiDocumentSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Order, User } from "@/constants";
import localDate from "@/lib/getLocalDate";
import UserAvatar from "@/components/UserAvatar";

interface props {
  data: Order[];
  onEditHandler(id: string): void;
  onRemoveHandler(id: string): void;
}

function userImage(user: User) {
  return (
    <UserAvatar rounded userImage={user?.image} size="sm">
      <div className="space-y-1 font-medium dark:text-white">
        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{user?.name}</div>
        <span className="text-xs font-extralight text-gray-500 dark:text-gray-400">@{user?.username}</span>
      </div>
    </UserAvatar >
  );
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
          <Table.HeadCell className="text-center">Waktu</Table.HeadCell>
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
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
              >
                <Table.Cell>{userImage(item.user)}</Table.Cell>
                <Table.Cell>{item.number}</Table.Cell>
                <Table.Cell>{localDate(item.updatedAt, 'long', false, true).substring(0, 5)}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell><span className="px-2 py-1 bg-gray-500 dark:bg-gray-400 rounded-full text-white dark:text-gray-700 text-xs font-semibold" >ON PROSES</span></Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2 justify-center">
                    <HiDocumentSearch
                      className="cursor-pointer text-blue-500"
                      onClick={() => onEditHandler(item.id)}
                    />
                    <HiPencil
                      className="cursor-pointer text-blue-500"
                      onClick={() => onEditHandler(item.id)}
                    />
                    <HiTrash
                      className="cursor-pointer text-red-500"
                      onClick={() => onRemoveHandler(item.id)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div >
  );
}
