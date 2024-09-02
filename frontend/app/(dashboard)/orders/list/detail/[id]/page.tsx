"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/constants";
import BackButton from "@/components/buttons/BackButton";
import { Label, Checkbox } from "flowbite-react";
import TableShowDetail from "../../_components/TableShowDetail";
import localDate from "@/lib/getLocalDate";
import UserAvatar from "@/components/UserAvatar";
import { twMerge } from "tailwind-merge";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch(
          `http://localhost:3002/api/orders/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );
        setOrder(await res.json());
      };
      fetchData();
    }
  }, [session]);

  const getStatus = (order: Order) => {
    let status: any = null;
    if ((order.MarkedPay || order.OrderDetails.some(od => od.MarkedPrinted) && !order.MarkedTaken)) {
      status = <span className="px-2 py-1 bg-gray-500 dark:bg-gray-400 rounded-full text-white dark:text-gray-700 text-xs font-semibold" >ON PROSES</span>
    } else if (order.MarkedTaken) {
      status = <span className="px-2 py-1 bg-gray-500 dark:bg-green-400 rounded-full text-white dark:text-green-700 text-xs font-semibold" >SELESAI</span>
    }
    return status;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Detail Pesanan : <span className="font-normal text-gray-500 dark:text-gray-400">{order?.user.name}</span> <span className="text-sm font-light text-gray-500 dark:text-gray-400">@{order?.user.username}</span>
      </h3>
      <div className="grid grid-cols-[auto,1fr] gap-x-24">
        <div className="flex gap-x-4">
          <div className="hidden xl:flex flex-col space-y-2 items-center">
            <UserAvatar
              width={80}
              height={80}
              userImage={order?.user?.image}
              size="lg"
              bordered
              rounded
            />
          </div>
          <div className="flex gap-x-6">
            <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
              <p>Tanggal</p>
              <span>:</span>
              <p className="font-medium">
                {localDate(Date.now(), 'long')}
              </p>
              <p>Pelanggan</p>
              <span>:</span>
              <p className="font-medium">
                {order?.customer}
              </p>
              <p>Keterangan</p>
              <span>:</span>
              <p className="font-medium">
                {order?.description}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <p className="font-semibold text-gray-500 dark:text-gray-400">Total</p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Item</p>
                <span>:</span>
                <p className="font-medium">
                  {order?.OrderDetails.length}
                </p>
                <p>Qty</p>
                <span>:</span>
                <p className="font-medium">
                  {order?.OrderDetails.reduce((acc, od) => acc + od.qty, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <p className="font-semibold text-gray-500 dark:text-gray-400">Status</p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Dibayar</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedPay?.status ? 'text-red-500' : 'text-red-400')}>
                  {order?.MarkedPay?.status ? 'Selesai' : 'Belum'}
                </p>
                <p>Diambil</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedPay?.status ? 'text-red-500' : 'text-red-400')}>
                  {order?.MarkedPay?.status ? 'Selesai' : 'Belum'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-between">
            <div>{order && getStatus(order)}</div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              Tandai sudah
              <Label htmlFor="marked-pay" className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
                <Checkbox id="marked-pay" />
                Dibayar
              </Label>
              <Label htmlFor="marked-taken" className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
                <Checkbox id="marked-taken" />
                Diambil
              </Label>
            </div>
          </div>
        </div>
      </div >
      <div className="flex flex-col gap-4">
        <TableShowDetail
          data={order?.OrderDetails || []}
        />
        {/* <ConfirmModal
          text="Anda yakin ingin membatalkan status ini?"
          openModal={showConfirmDeleteModal}
          onCloseHandler={() => setShowConfirmDeleteModal(false)}
          onYesHandler={() => {
            if (isEditMode && deletedIndex !== -1) {
              const deletedOd = orderDetails[deletedIndex!];
              deletedOd.deleted = true;
              setDeletedOrderDetails(prevState => [...prevState, deletedOd]);
            }
            const updatedData = orderDetails.filter((_, i) => i !== deletedIndex);
            setOrderDetails([...updatedData]);
            setShowConfirmDeleteModal(false);
          }}
        />
        <ConfirmModal
          yesButtonColor="success"
          text="Anda yakin ingin menyimpan data ini?"
          openModal={showConfirmSaveModal}
          onCloseHandler={() => setShowConfirmSaveModal(false)}
          onYesHandler={() => {
            onSubmit();
          }}
        /> */}
      </div>
    </div >
  );
}
