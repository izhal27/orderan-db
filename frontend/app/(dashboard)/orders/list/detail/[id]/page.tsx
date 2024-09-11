"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Label, Checkbox } from "flowbite-react";
import debounce from "lodash.debounce";
import { twMerge } from "tailwind-merge";
import { MarkedPrinted, Order, Roles } from "@/constants";
import UserAvatar from "@/components/UserAvatar";
import BackButton from "@/components/buttons/BackButton";
import SkeletonTable from "@/components/SkeletonTable";
import ShowDetailOrderTable from "../../_components/ShowDetailOrderTable";
import LabelStatus from "../../_components/LabelStatus";
import { isContain, showToast } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { useLoading } from "@/context/LoadingContext";
import { useOrderStatusWebSocket } from "@/lib/useOrderStatusWebSocket";
import { useMoment } from "@/lib/useMoment";

type EventType = {
  urlMarked: string;
  urlCancel: string;
  body: any;
  isChecked: boolean;
  onSuccessMarkedHandler(result: any): void;
  onSuccessUnmarkedHandler(result: any): void;
}

export default function DetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const { setLoading: setModalLoading } = useLoading();
  const fetchedRef = useRef(false);
  const { request } = useApiClient();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { order, setOrder } = useOrderStatusWebSocket(undefined);
  const { moment } = useMoment();

  const fetchOrder = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setLoading(true);
    try {
      const result = await request(`/orders/${params.id}`);
      setOrder(result);
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

  const sendPostMarked = useCallback(debounce(async ({
    urlMarked, urlCancel, body, isChecked, onSuccessMarkedHandler, onSuccessUnmarkedHandler }: EventType) => {
    setModalLoading(true);
    try {
      if (isChecked) {
        const result = await request(urlMarked, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        onSuccessMarkedHandler(result);
      } else {
        const result = await request(urlCancel, {
          method: 'POST'
        });
        onSuccessUnmarkedHandler(result);
      }
    } catch (error) {
      showToast('error', 'Terjadi kesalahan, coba lagi nanti');
    }
    setModalLoading(false);
  }, 500), [session?.accessToken, order]);

  const handleCheckboxPrintedClick = useCallback((e: any, id: string) => {
    const isChecked = e.target.checked;
    sendPostMarked({
      urlMarked: `/orders/detail/${id}/print`,
      urlCancel: `/orders/detail/${id}/cancel-print`,
      body: {
        status: true,
        printAt: new Date().toISOString()
      },
      isChecked,
      onSuccessMarkedHandler: (result) => {
        updatePrintedStatus(result.orderDetailId, result);
        showToast('success', 'Berhasil ditandai sudah dicetak');
      },
      onSuccessUnmarkedHandler: (result) => {
        updatePrintedStatus(result.orderDetailId, result);
        showToast('warning', 'Berhasil menghapus tanda sudah dicetak');
      },
    });
  }, [sendPostMarked, order]);

  const updatePrintedStatus = useCallback((orderDetailId: string, markedPrint: MarkedPrinted) => {
    const index = order?.OrderDetails?.findIndex(od => od.id === orderDetailId);
    if (index !== undefined && order) {
      const od = order.OrderDetails.at(index)!;
      od.MarkedPrinted = { ...od.MarkedPrinted, ...markedPrint };
      const updatedOd = order.OrderDetails.toSpliced(index, 1, od);

      setOrder(prevOrder => {
        const updatedState = prevOrder;
        updatedState!.OrderDetails = [...updatedOd];
        return updatedState;
      });
    }
  }, [order]);

  const toggleRowExpanded = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  }

  const handleCheckboxPayClick = (e: any) => {
    const isChecked = e.target.checked;
    const updateState = (result: any) => {
      setOrder(prevOrder => {
        let updatedState = { ...prevOrder! };
        updatedState.MarkedPay = { ...result };
        return updatedState;
      });
    }
    sendPostMarked({
      urlMarked: `/orders/${order?.id}/pay`,
      urlCancel: `/orders/${order?.id}/cancel-pay`,
      body: {
        status: true,
        payAt: new Date().toISOString()
      },
      isChecked,
      onSuccessMarkedHandler: (result) => {
        updateState(result);
        showToast('success', 'Berhasil ditandai sudah dibayar');
      },
      onSuccessUnmarkedHandler: (result) => {
        updateState(result);
        showToast('warning', 'Berhasil menghapus tanda sudah dibayar');
      },
    });
  };

  const handleCheckboxTakenClick = (e: any) => {
    const isChecked = e.target.checked;
    const updateState = (result: any) => {
      setOrder(prevOrder => {
        let updatedState = { ...prevOrder! };
        updatedState.MarkedTaken = { ...result };
        return updatedState;
      });
    }
    sendPostMarked({
      urlMarked: `/orders/${order?.id}/taken`,
      urlCancel: `/orders/${order?.id}/cancel-taken`,
      body: {
        status: true,
        takenAt: new Date().toISOString()
      },
      isChecked,
      onSuccessMarkedHandler: (result) => {
        updateState(result);
        showToast('success', 'Berhasil ditandai sudah diambil');
      },
      onSuccessUnmarkedHandler: (result) => {
        updateState(result);
        showToast('warning', 'Berhasil menghapus tanda sudah diambil');
      },
    });
  };

  const getStatusLabel = (order: Order) => {
    return LabelStatus({ order });
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
        <ShowDetailOrderTable
          order={order}
          expandedRowId={expandedRowId}
          onExpandedRowToggleHandler={(id) => toggleRowExpanded(id)}
          onCheckBoxPrintedClickHandler={handleCheckboxPrintedClick}
          role={session?.user?.role}
        />
      );
    }
  }, [loading, session, order, expandedRowId]);

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
            <div className="grid grid-cols-[auto,auto,1fr] text-sm gap-x-4 text-gray-500 dark:text-gray-400">
              <p>Tanggal</p><span>:</span><p>{`${moment(Date.now()).format('dddd')}, ${moment(Date.now()).format('LL')}`}</p>
              <p>Pelanggan</p><span>:</span><p>{order?.customer}</p>
              <p>Keterangan</p><span>:</span><p>{order?.description}</p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <p className="font-medium text-gray-500 dark:text-gray-400">Total</p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Item</p><span>:</span><p>{order?.OrderDetails?.length}</p>
                <p>Qty</p><span>:</span><p>
                  {order?.OrderDetails?.reduce((acc, od) => acc + od.qty, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <p className="font-medium text-gray-500 dark:text-gray-400">Status</p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Dibayar</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedPay?.status ? 'text-green-400' : 'text-red-400')}>
                  {order?.MarkedPay?.status ? 'Selesai' : 'Belum'}
                </p>
                {order?.MarkedPay &&
                  <span
                    className="text-xs col-span-3 font-light">
                    {order?.MarkedPay?.status ? 'Ditandai' : 'Dibatalkan'} oleh {`${order?.MarkedPay.MarkedBy?.name} @${order?.MarkedPay.MarkedBy?.username} ${moment(order?.MarkedPay?.updatedAt).format('LLLL')}`}
                  </span>}
                <p>Diambil</p>
                <span>:</span>
                <p className={twMerge("font-medium", order?.MarkedTaken?.status ? 'text-green-400' : 'text-red-400')}>
                  {order?.MarkedTaken?.status ? 'Selesai' : 'Belum'}
                </p>
                {order?.MarkedTaken &&
                  <span className="text-xs col-span-3 font-light">
                    {order?.MarkedTaken?.status ? 'Ditandai' : 'Dibatalkan'} oleh {`${order?.MarkedTaken.MarkedBy?.name} @${order?.MarkedTaken.MarkedBy?.username} ${moment(order?.MarkedTaken?.updatedAt).format('LLLL')}`}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-between items-end">
            <div>{order && getStatusLabel(order)}</div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              {
                // hanya user yang bertipe role admin atau administrasi yang bisa menandai terbayar dan diambil
                isContain(session?.user?.role || '', Roles.ADMIN) || isContain(session?.user?.role || '', Roles.ADMINISTRASI) ?
                  <>
                    <Label htmlFor="marked-pay" className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
                      <Checkbox
                        id="marked-pay"
                        onChange={handleCheckboxPayClick}
                        checked={order?.MarkedPay?.status || false}
                        // disable jika status sudah diambil
                        // disabled={order?.MarkedTaken?.status}
                        className="disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                      Dibayar
                    </Label>
                    <Label htmlFor="marked-taken" className="flex gap-2 items-center text-gray-500 dark:text-gray-400">
                      <Checkbox
                        id="marked-taken"
                        onChange={handleCheckboxTakenClick}
                        checked={order?.MarkedTaken?.status || false}
                        // disable jika belum ada pembayaran atau semua belum ditandai dicetak
                        disabled={!order?.OrderDetails?.every(od => od.MarkedPrinted?.status)}
                        className="disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                      Diambil
                    </Label>
                  </> : null
              }
            </div>
          </div>
        </div>
      </div >
      <div className="flex flex-col gap-4">
        {table}
      </div>
    </div >
  );
}