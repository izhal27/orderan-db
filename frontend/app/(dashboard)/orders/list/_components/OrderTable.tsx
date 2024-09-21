"use client";

import UserAvatar from "@/components/UserAvatar";
import type { Order, User } from "@/constants";
import { Roles } from "@/constants";
import { isContain } from "@/helpers";
import { useMoment } from "@/lib/useMoment";
import { Table } from "flowbite-react";
import type { Session } from "next-auth";
import { HiDocumentSearch, HiPencil, HiTrash } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import LabelStatus from "./LabelStatus";

interface props {
  order: Order[];
  onEditHandler(id: string): void;
  onDetailHandler(id: string): void;
  onRemoveHandler(id: string): void;
  session: Session | null;
  reportMode?: boolean;
}

function userImage(user: User) {
  return (
    <UserAvatar rounded userImage={user?.image} size="sm">
      <div className="flex flex-col items-start gap-1 font-medium dark:text-white">
        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
          {user?.name}
        </div>
        <span className="text-xs font-extralight text-gray-500 dark:text-gray-400">
          @{user?.username}
        </span>
      </div>
    </UserAvatar>
  );
}

const getStatus = (order: Order) => {
  return LabelStatus({
    order,
    classNameOnProses: "px-3 text-xs",
    classNameDone: "px-3 text-xs",
  });
};

export default function OrderTable({
  order,
  onEditHandler,
  onDetailHandler,
  onRemoveHandler,
  session,
  reportMode = false,
}: props) {
  const { moment } = useMoment();

  // hanya user yang membuat order atau admin, administrasi yang bisa edit dan hapus order
  const canEditOrder = (item: Order) => {
    if (!session) return false;
    const isCreator = session?.user?.id === item.user?.id;
    const userRole = session?.user?.role;
    const isAdminOrAdministrasi =
      isContain(userRole, Roles.ADMIN) ||
      isContain(userRole, Roles.ADMINISTRASI);
    return isCreator || isAdminOrAdministrasi;
  };

  // jika role user saat ini designer atau operator dan status sudah on proses
  // maka sembunyikan button edit dan hapus
  const isOrderInProcess = (item: Order) => {
    if (!session) return;
    const userRole = session?.user?.role;
    const isAdminOrAdministrasi =
      isContain(userRole, Roles.ADMIN) ||
      isContain(userRole, Roles.ADMINISTRASI);
    return (
      !isAdminOrAdministrasi &&
      (item.MarkedPay?.status ||
        item.MarkedTaken?.status ||
        item.OrderDetails.some((od) => od.MarkedPrinted?.status))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="text-center">User</Table.HeadCell>
          <Table.HeadCell className="text-center">Nomor</Table.HeadCell>
          <Table.HeadCell className="text-center">Waktu</Table.HeadCell>
          <Table.HeadCell className="text-center">Pelanggan</Table.HeadCell>
          {!reportMode && (
            <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
          )}
          <Table.HeadCell className="text-center">Status</Table.HeadCell>
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {order?.map((item: Order) => {
            return (
              <Table.Row
                key={item.id}
                className={twMerge(
                  "bg-white text-center dark:border-gray-700 dark:bg-gray-800",
                  item.animate ? "animate-splash dark:animate-splashDark" : "",
                )}
              >
                <Table.Cell className="flex">{userImage(item.user)}</Table.Cell>
                <Table.Cell>{item.number}</Table.Cell>
                <Table.Cell>{moment(item.updatedAt).format("DD MMM YYYY HH.mm")}</Table.Cell>
                <Table.Cell>{item.customer}</Table.Cell>
                {!reportMode && <Table.Cell>{item.description}</Table.Cell>}
                <Table.Cell>{getStatus(item)}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-2">
                    <HiDocumentSearch
                      className="cursor-pointer text-blue-500"
                      onClick={() => onDetailHandler(item.id)}
                    />
                    {canEditOrder(item) && !isOrderInProcess(item) && (
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
