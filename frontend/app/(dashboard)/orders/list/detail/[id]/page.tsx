"use client";

import BackButton from "@/components/buttons/BackButton";
import SkeletonTable from "@/components/SkeletonTable";
import UserAvatar from "@/components/UserAvatar";
import { Roles } from "@/constants";
import { useLoading } from "@/context/LoadingContext";
import { isContain, showToast } from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
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

type EventType = {
  urlMarked: string;
  urlCancel: string;
  body: BodyType;
  isChecked: boolean;
  onSuccessMarkedHandler(): void;
  onSuccessUnmarkedHandler(): void;
};

export default function DetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();
  const fetchedRef = useRef(false);
  const { request } = useApiClient();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { order, setOrder } = useOrderStatusWebSocket(undefined);
  const { moment } = useMoment();

  const fetchOrder = useCallback(async () => {
    if (status === "loading" || !session?.accessToken) return;
    setIsLoading(true);
    try {
      const result = await request(`/orders/${params.id}`);
      setOrder(result);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, params.id, status]);

  useEffect(() => {
    if (session?.accessToken && !fetchedRef.current) {
      fetchOrder();
      fetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  const sendPostMarked = debounce(
    async ({
      urlMarked,
      urlCancel,
      body,
      isChecked,
      onSuccessMarkedHandler,
      onSuccessUnmarkedHandler,
    }: EventType) => {
      setLoading(true);
      try {
        if (isChecked) {
          await request(urlMarked, {
            method: "POST",
            body: JSON.stringify(body),
          });
          onSuccessMarkedHandler();
        } else {
          await request(urlCancel, {
            method: "POST",
          });
          onSuccessUnmarkedHandler();
        }
      } catch (error) {
        showToast("error", "Terjadi kesalahan, coba lagi nanti");
      }
      setLoading(false);
    },
    500,
  );

  const handleCheckboxPrintedClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const isChecked = e.target.checked;
      sendPostMarked({
        urlMarked: `/orders/detail/${id}/print`,
        urlCancel: `/orders/detail/${id}/cancel-print`,
        body: {
          status: true,
          printAt: new Date().toISOString(),
        },
        isChecked,
        onSuccessMarkedHandler: () => {
          showToast("success", "Berhasil ditandai sudah dicetak");
        },
        onSuccessUnmarkedHandler: () => {
          showToast("warning", "Berhasil menghapus tanda sudah dicetak");
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendPostMarked],
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
        onSuccessMarkedHandler: () => {
          showToast("success", "Berhasil ditandai sudah dibayar");
        },
        onSuccessUnmarkedHandler: () => {
          showToast("warning", "Berhasil menghapus tanda sudah dibayar");
        },
      });
    },
    [order?.id, sendPostMarked],
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
        onSuccessMarkedHandler: () => {
          showToast("success", "Berhasil ditandai sudah diambil");
        },
        onSuccessUnmarkedHandler: () => {
          showToast("warning", "Berhasil menghapus tanda sudah diambil");
        },
      });
    },
    [order?.id, sendPostMarked],
  );

  const table = useMemo(() => {
    if (status === "loading" || isLoading) {
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
          orderDetails={order?.OrderDetails || []}
          expandedRowId={expandedRowId}
          onExpandedRowToggleHandler={(id: string) => {
            setExpandedRowId(expandedRowId === id ? null : id);
          }}
          onCheckBoxPrintedClickHandler={handleCheckboxPrintedClick}
          role={session?.user?.role}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    session?.user?.role,
    order,
    expandedRowId,
    handleCheckboxPrintedClick,
    status,
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
