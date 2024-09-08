"use client";

import { Table } from "flowbite-react";
import { HiCheck, HiDocumentSearch, HiPencil, HiTrash } from "react-icons/hi";
import { Order, Roles, User } from "@/constants";
import localDate from "@/lib/getLocalDate";
import UserAvatar from "@/components/UserAvatar";
import { twMerge } from "tailwind-merge";

interface props {
  order: Order[];
  onEditHandler(id: string): void;
  onDetailHandler(id: string): void;
  onRemoveHandler(id: string): void;
  session: any | undefined;
}

function userImage(user: User) {
  return (
    <UserAvatar rounded userImage={user?.image} size="sm">
      <div className="flex flex-col gap-1 items-start font-medium dark:text-white">
        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{user?.name}</div>
        <span className="text-xs font-extralight text-gray-500 dark:text-gray-400">@{user?.username}</span>
      </div>
    </UserAvatar >
  );
}

const getStatus = (order: Order) => {
  let status: any = '-';
  if ((order.MarkedPay?.status || order.OrderDetails.some(od => od.MarkedPrinted?.status) && !order.MarkedTaken?.status)) {
    status = <span className="px-3 py-1 bg-gray-500 dark:bg-gray-400 rounded-full text-white dark:text-gray-700 text-xs font-semibold">ON PROSES</span>
  }
  if (order.MarkedPay?.status && order.OrderDetails.every(od => od.MarkedPrinted?.status) && order.MarkedTaken?.status) {
    status = <span className="px-3 py-1 bg-green-500 dark:bg-green-400 rounded-full text-white dark:text-gray-700 text-xs font-semibold inline-flex items-center justify-center w-fit gap-2"><HiCheck className="inline-block" /> SELESAI</span>
  }
  return status;
}

export default function OrderTable({
  order,
  onEditHandler,
  onDetailHandler,
  onRemoveHandler,
  session,
}: props) {
  // hanya user yang membuat order atau admin, administrasi yang bisa edit dan hapus order
   const canEditOrder = (item: Order) => {
    if (!session) return false;    
    const isCreator = session.user.id === item.user.id;
    const isAdminOrAdministrasi = session.user.role.includes(Roles.ADMIN) || session.user.role.includes(Roles.ADMINISTRASI);    
    return isCreator || isAdminOrAdministrasi;
  };

  // jika role user saat ini designer atau operator dan status sudah on proses
  // maka sembunyikan button edit dan hapus
  const isOrderInProcess = (item: Order) => {
    const isAdminOrAdministrasi = session.user.role.includes(Roles.ADMIN) || session.user.role.includes(Roles.ADMINISTRASI);
    return !isAdminOrAdministrasi && (item.MarkedPay?.status || item.MarkedTaken?.status || item.OrderDetails.some(od => od.MarkedPrinted?.status));
  };

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
          {order?.map((item: Order) => {
            return (
              <Table.Row
                key={item.id}
                className={twMerge("bg-white dark:border-gray-700 dark:bg-gray-800 text-center", item.animate ? "animate-splash dark:animate-splashDark" : "")}
              >
                <Table.Cell className="flex">{userImage(item.user)}</Table.Cell>
                <Table.Cell>{item.number}</Table.Cell>
                <Table.Cell>{localDate(item.updatedAt, 'long', false, true).substring(0, 5)}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{getStatus(item)}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2 justify-center">
                    <HiDocumentSearch
                      className="cursor-pointer text-blue-500"
                      onClick={() => onDetailHandler(item.id)}
                    />
                    {
                      canEditOrder(item) && !isOrderInProcess(item) && (
                        <>
                          <HiPencil
                            className="cursor-pointer text-blue-500"
                            onClick={() => onEditHandler(item.id)}
                          />
                          <HiTrash
                            className="cursor-pointer text-red-500"
                            onClick={() => onRemoveHandler(item.id)}
                          />
                        </>
                      )
                    }
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
