"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/constants";
import BackButton from "@/components/buttons/BackButton";
import { Label } from "flowbite-react";
import TableShowDetail from "../../_components/TableShowDetail";
import localDate from "@/lib/getLocalDate";

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

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Detail Pesanan
      </h3>
      <div className="max-w-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="tanggal"
                value="Tanggal"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">
                {localDate(Date.now(), 'long')}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="pelanggan"
                value="Pelanggan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <p className="font-medium text-gray-500 dark:text-gray-400">
                {order?.customer}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="keterangan"
                value="Keterangan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <p className="font-medium text-gray-500 dark:text-gray-400">
                {order?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}
