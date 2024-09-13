"use client";

import BackButton from "@/components/buttons/BackButton";
import SkeletonTable from "@/components/SkeletonTable";
import UserAvatar from "@/components/UserAvatar";
import type {
  MarkedPay,
  MarkedPrinted,
  MarkedTaken,
  OrderDetail,
} from "@/constants";
import { Roles } from "@/constants";
import { useLoading } from "@/context/LoadingContext";
import { isContain, showToast } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { useMoment } from "@/lib/useMoment";
import { useOrderStatusWebSocket } from "@/lib/useOrderStatusWebSocket";
import { Checkbox, Label } from "flowbite-react";
import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import LabelStatus from "../../_components/LabelStatus";
import ShowDetailOrderTable from "../../_components/ShowDetailOrderTable";

type BodyType = {
  status: boolean;
  printAt?: string;
  payAt?: string;
  takenAt?: string;
};

type ResultType = {
  orderDetailId?: string;
  status: boolean;
  printAt?: string;
  payAt?: string;
  takenAt?: string;
  MarkedBy?: {
    name: string;
    username: string;
  };
  updatedAt: string;
};

type EventType = {
  urlMarked: string;
  urlCancel: string;
  body: BodyType;
  isChecked: boolean;
  onSuccessMarkedHandler(result: ResultType): void;
  onSuccessUnmarkedHandler(result: ResultType): void;
};

export default function DetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const { setLoading: setModalLoading } = useLoading();
  const fetchedRef = useRef(false);
  const { request } = useApiClient();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { order, setOrder } = useOrderStatusWebSocket(undefined);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const { moment } = useMoment();

  const fetchOrder = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setLoading(true);
    try {
      const result = await request(`/orders/${params.id}`);
      setOrder(result);
      setOrderDetails(result.OrderDetails);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken, request, params.id, setOrder]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrder();
      fetchedRef.current = true;
    }
  }, [session, fetchOrder]);

  const sendPostMarked = debounce(
    async ({
      urlMarked,
      urlCancel,
      body,
      isChecked,
      onSuccessMarkedHandler,
      onSuccessUnmarkedHandler,
    }: EventType) => {
      setModalLoading(true);
      try {
        if (isChecked) {
          const result = await request(urlMarked, {
            method: "POST",
            body: JSON.stringify(body),
          });
          onSuccessMarkedHandler(result);
        } else {
          const result = await request(urlCancel, {
            method: "POST",
          });
          onSuccessUnmarkedHandler(result);
        }
      } catch (error) {
        showToast("error", "Terjadi kesalahan, coba lagi nanti");
      }
      setModalLoading(false);
    },
    500,
  );

  const updatePrintedStatus = (
    orderDetailId: string,
    markedPrint: MarkedPrinted,
  ) => {
    setOrderDetails((prevOrderDetails) => {
      const updatedOrderDetails = prevOrderDetails.map((detail) =>
        detail.id === orderDetailId
          ? { ...detail, MarkedPrinted: markedPrint }
          : detail,
      );
      return [...updatedOrderDetails];
    });
  };

  const handleCheckboxPrintedClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const isChecked = e.target.checked;
      console.log("CHECKED", isChecked);

      sendPostMarked({
        urlMarked: `/orders/detail/${id}/print`,
        urlCancel: `/orders/detail/${id}/cancel-print`,
        body: {
          status: true,
          printAt: new Date().toISOString(),
        },
        isChecked,
        onSuccessMarkedHandler: (result) => {
          updatePrintedStatus(
            result.orderDetailId || "",
            result as MarkedPrinted,
          );
          showToast("success", "Berhasil ditandai sudah dicetak");
        },
        onSuccessUnmarkedHandler: (result) => {
          updatePrintedStatus(
            result.orderDetailId || "",
            result as MarkedPrinted,
          );
          showToast("warning", "Berhasil menghapus tanda sudah dicetak");
        },
      });
    },
    [sendPostMarked],
  );

  const updateStateMarkedPay = useCallback(
    (result: MarkedPay) => {
      setOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;
        const updatedState = { ...prevOrder };
        updatedState.MarkedPay = { ...result };
        return updatedState;
      });
    },
    [setOrder],
  );

  const handleCheckboxPayClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      sendPostMarked({
        urlMarked: `/orders/${order?.id}/pay`,
        urlCancel: `/orders/${order?.id}/cancel-pay`,
        body: {
          status: true,
          payAt: new Date().toISOString(),
        },
        isChecked,
        onSuccessMarkedHandler: (result) => {
          updateStateMarkedPay(result as MarkedPay);
          showToast("success", "Berhasil ditandai sudah dibayar");
        },
        onSuccessUnmarkedHandler: (result) => {
          updateStateMarkedPay(result as MarkedPay);
          showToast("warning", "Berhasil menghapus tanda sudah dibayar");
        },
      });
    },
    [order?.id, sendPostMarked, updateStateMarkedPay],
  );

  const updateStateMarkedTaken = useCallback(
    (result: MarkedTaken) => {
      setOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;
        const updatedState = { ...prevOrder };
        updatedState.MarkedTaken = { ...result };
        return updatedState;
      });
    },
    [setOrder],
  );

  const handleCheckboxTakenClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      sendPostMarked({
        urlMarked: `/orders/${order?.id}/taken`,
        urlCancel: `/orders/${order?.id}/cancel-taken`,
        body: {
          status: true,
          takenAt: new Date().toISOString(),
        },
        isChecked,
        onSuccessMarkedHandler: (result) => {
          updateStateMarkedTaken(result as MarkedTaken);
          showToast("success", "Berhasil ditandai sudah diambil");
        },
        onSuccessUnmarkedHandler: (result) => {
          updateStateMarkedTaken(result as MarkedTaken);
          showToast("warning", "Berhasil menghapus tanda sudah diambil");
        },
      });
    },
    [order?.id, sendPostMarked, updateStateMarkedTaken],
  );

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={[
            "Nama",
            "Lebar",
            "Tinggi",
            "Qty",
            "Design",
            "Mata Ayam",
            "Shiming",
            "Keterangan",
            "Dicetak",
          ]}
        />
      );
    } else {
      return (
        <ShowDetailOrderTable
          markedTaken={order?.MarkedTaken?.status}
          orderDetails={orderDetails || []}
          expandedRowId={expandedRowId}
          onExpandedRowToggleHandler={(id: string) => {
            setExpandedRowId(expandedRowId === id ? null : id);
          }}
          onCheckBoxPrintedClickHandler={handleCheckboxPrintedClick}
          role={session?.user?.role}
        />
      );
    }
  }, [
    loading,
    session?.user?.role,
    order,
    orderDetails,
    expandedRowId,
    handleCheckboxPrintedClick,
  ]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Detail Pesanan :{" "}
        <span className="font-normal text-gray-500 dark:text-gray-400">
          {order?.user?.name}
        </span>{" "}
        <span className="text-sm font-light text-gray-500 dark:text-gray-400">
          @{order?.user?.username}
        </span>
      </h3>
      <div className="grid grid-cols-[auto,1fr] gap-x-24">
        <div className="flex gap-x-4">
          <div className="hidden flex-col items-center space-y-2 xl:flex">
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
            <div className="grid grid-cols-[auto,auto,1fr] gap-x-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Tanggal</p>
              <span>:</span>
              <p>{`${moment(Date.now()).format("dddd")}, ${moment(Date.now()).format("LL")}`}</p>
              <p>Pelanggan</p>
              <span>:</span>
              <p>{order?.customer}</p>
              <p>Keterangan</p>
              <span>:</span>
              <p>{order?.description}</p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <p className="font-medium text-gray-500 dark:text-gray-400">
                Total
              </p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Item</p>
                <span>:</span>
                <p>{order?.OrderDetails?.length}</p>
                <p>Qty</p>
                <span>:</span>
                <p>
                  {order?.OrderDetails?.reduce((acc, od) => acc + od.qty, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <p className="font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <div className="grid grid-cols-[auto,auto,1fr] items-center gap-x-4 text-gray-500 dark:text-gray-400">
                <p>Dibayar</p>
                <span>:</span>
                <p
                  className={twMerge(
                    "font-medium",
                    order?.MarkedPay?.status
                      ? "text-green-400"
                      : "text-red-400",
                  )}
                >
                  {order?.MarkedPay?.status ? "Selesai" : "Belum"}
                </p>
                {order?.MarkedPay && (
                  <span className="col-span-3 text-xs font-light">
                    {order?.MarkedPay?.status ? "Ditandai" : "Dibatalkan"} oleh{" "}
                    {`${order?.MarkedPay.MarkedBy?.name} @${order?.MarkedPay.MarkedBy?.username} ${moment(order?.MarkedPay?.updatedAt).format("LLLL")}`}
                  </span>
                )}
                <p>Diambil</p>
                <span>:</span>
                <p
                  className={twMerge(
                    "font-medium",
                    order?.MarkedTaken?.status
                      ? "text-green-400"
                      : "text-red-400",
                  )}
                >
                  {order?.MarkedTaken?.status ? "Selesai" : "Belum"}
                </p>
                {order?.MarkedTaken && (
                  <span className="col-span-3 text-xs font-light">
                    {order?.MarkedTaken?.status ? "Ditandai" : "Dibatalkan"}{" "}
                    oleh{" "}
                    {`${order?.MarkedTaken.MarkedBy?.name} @${order?.MarkedTaken.MarkedBy?.username} ${moment(order?.MarkedTaken?.updatedAt).format("LLLL")}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col items-end justify-between">
            <div>{order && LabelStatus({ order })}</div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              {
                // hanya user yang bertipe role admin atau administrasi yang bisa menandai terbayar dan diambil
                isContain(session?.user?.role || "", Roles.ADMIN) ||
                isContain(session?.user?.role || "", Roles.ADMINISTRASI) ? (
                  <>
                    <Label
                      htmlFor="marked-pay"
                      className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                    >
                      <Checkbox
                        id="marked-pay"
                        onChange={handleCheckboxPayClick}
                        checked={order?.MarkedPay?.status || false}
                        // disable jika status sudah diambil
                        // disabled={order?.MarkedTaken?.status}
                        className="disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                      Dibayar
                    </Label>
                    <Label
                      htmlFor="marked-taken"
                      className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                    >
                      <Checkbox
                        id="marked-taken"
                        onChange={handleCheckboxTakenClick}
                        checked={order?.MarkedTaken?.status || false}
                        // disable jika belum ada pembayaran atau semua belum ditandai dicetak
                        disabled={
                          !order?.OrderDetails?.every(
                            (od) => od.MarkedPrinted?.status,
                          )
                        }
                        className="disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                      Diambil
                    </Label>
                  </>
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">{table}</div>
    </div>
  );
}
