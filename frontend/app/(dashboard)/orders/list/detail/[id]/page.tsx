"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MarkedPrinted, Order } from "@/constants";
import BackButton from "@/components/buttons/BackButton";
import { Label, Checkbox } from "flowbite-react";
import TableShowDetail from "../../_components/TableShowDetail";
import localDate from "@/lib/getLocalDate";
import UserAvatar from "@/components/UserAvatar";
import { twMerge } from "tailwind-merge";
import SkeletonTable from "@/components/SkeletonTable";
import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { useLoading } from "@/context/LoadingContext";
import debounce from "lodash.debounce";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { setLoading: setModalLoading } = useLoading();
  const fetchedRef = useRef(false);
  const { request } = useApiClient();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setLoading(true);
    try {
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
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken])

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrder();
      fetchedRef.current = true;
    }
  }, [session]);

  const sendPostMarkedPrinted = useCallback(debounce(async (isChecked: boolean, id: string) => {
    setModalLoading(true);
    try {
      if (isChecked) {
        const data = await request(`/orders/detail/${id}/print`, {
          method: 'POST',
          body: {
            status: true,
            printAt: new Date().toISOString()
          }
        });
        updatePrintedStatus(data.orderDetailId, data);
        showToast('success', 'Berhasil ditandai sudah dicetak');
      } else {
        const data = await request(`/orders/detail/${id}/cancel-print`, {
          method: 'POST',
          body: {}
        });
        updatePrintedStatus(data.orderDetailId, data);
        showToast('warning', 'Berhasil menghapus tanda sudah dicetak');
      }
    } catch (error) {
      showToast('error', 'Terjadi kesalahan, coba lagi nanti');
    }
    setModalLoading(false);
  }, 500), [session?.accessToken]);

  const handleCheckboxPrintedClick = (e: any, id: string) => {
    const isChecked = e.target.checked;
    sendPostMarkedPrinted(isChecked, id);
  };

  const updatePrintedStatus = useCallback((orderDetailId: string, markedPrint: MarkedPrinted) => {
    const index = order?.OrderDetails?.findIndex(od => od.id === orderDetailId);
    if (index !== undefined && order) {
      const od = order.OrderDetails.at(index)!;
      od.MarkedPrinted = { ...od.MarkedPrinted, ...markedPrint };
      const updatedOd = order.OrderDetails.toSpliced(index, 1, od);
      setOrder(prevState => {
        prevState!.OrderDetails = [...updatedOd];
        return prevState;
      });
    }
  }, [order]);

  const toggleRowExpanded = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  }

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={["Nama", "Lebar", "Tinggi", "Qty", "Design", "Mata Ayam", "Shiming", "Keterangan", "Dicetak"]}
        />
      );
    } else {
      return (
        <TableShowDetail
          data={order?.OrderDetails || []}
          expandedRowId={expandedRowId}
          onExpandedRowToggleHandler={(id) => toggleRowExpanded(id)}
          onCheckBoxPrintedClickHandler={handleCheckboxPrintedClick}
        />
      );
    }
  }, [loading, order?.OrderDetails, expandedRowId]);

  const getStatus = useCallback((order: Order) => {
    let status: any = null;
    if ((order.MarkedPay || order.OrderDetails.some(od => od.MarkedPrinted?.status) && !order.MarkedTaken)) {
      status = <span className="px-3 py-2 bg-gray-500 dark:bg-gray-400 rounded-full text-white dark:text-gray-700 text-base font-semibold" >ON PROSES</span>
    } else if (order?.MarkedTaken?.status) {
      status = <span className="px-3 py-2 bg-gray-500 dark:bg-green-400 rounded-full text-white dark:text-green-700 text-base font-semibold" >SELESAI</span>
    }
    return status;
  }, [order, order?.OrderDetails]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Detail Pesanan : <span className="font-normal text-gray-500 dark:text-gray-400">{order?.user?.name}</span> <span className="text-sm font-light text-gray-500 dark:text-gray-400">@{order?.user?.username}</span>
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
                  {order?.OrderDetails?.length}
                </p>
                <p>Qty</p>
                <span>:</span>
                <p className="font-medium">
                  {order?.OrderDetails?.reduce((acc, od) => acc + od.qty, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <p className="font-semibold text-gray-500 dark:text-gray-400">Status</p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Dibayar</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedPay?.status ? 'text-green-400' : 'text-red-400')}>
                  {order?.MarkedPay?.status ? 'Selesai' : 'Belum'}
                </p>
                <p>Diambil</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedPay?.status ? 'text-green-400' : 'text-red-400')}>
                  {order?.MarkedPay?.status ? 'Selesai' : 'Belum'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-between items-end">
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
        {table}
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
