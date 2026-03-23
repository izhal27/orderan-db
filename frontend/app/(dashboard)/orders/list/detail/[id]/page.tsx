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
import ConfirmPasswordModal from "../../_components/ConfirmPasswordModal";
import ConfirmActionModal from "../../_components/ConfirmActionModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "printed-all" | "pay" | "taken";
    checked: boolean;
  } | null>(null);
  const [currentCheckbox, setCurrentCheckbox] = useState<{
    type: string;
    state: boolean;
    id?: string;
  } | null>(null);

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

  const handleModalConfirm = useCallback(
    async (password: string) => {
      setIsModalOpen(false);
      if (!currentCheckbox) return;

      try {
        const valid = await request("/auth/validate-password", {
          method: "POST",
          body: JSON.stringify({ password }),
        });

        if (valid) {
          if (currentCheckbox.type === "printed") {
            handleCheckboxPrintedClick(
              {
                target: { checked: currentCheckbox.state },
              } as React.ChangeEvent<HTMLInputElement>,
              currentCheckbox.id as string,
            );
          } else if (currentCheckbox.type === "printed-all") {
            handleCheckboxPrintedAllClick({
              target: { checked: currentCheckbox.state },
            } as React.ChangeEvent<HTMLInputElement>);
          } else if (currentCheckbox.type === "pay") {
            handleCheckboxPayClick({
              target: { checked: currentCheckbox.state },
            } as React.ChangeEvent<HTMLInputElement>);
          } else if (currentCheckbox.type === "taken") {
            handleCheckboxTakenClick({
              target: { checked: currentCheckbox.state },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        } else {
          showToast("error", "Verifikasi password gagal");
        }
      } catch (error) {
        showToast("error", "Terjadi kesalahan saat memvalidasi password");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCheckbox],
  );

  const handleCheckboxClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxType: string,
    id?: string,
  ) => {
    // TEMP: bypass password confirmation (enable again later)
    // e.preventDefault();
    // setCurrentCheckbox({ type: checkboxType, state: e.target.checked, id });
    // setIsModalOpen(true);
    // // Reset the checkbox state to its previous value to prevent default behavior
    // e.target.checked = !e.target.checked;
    const checked = e.target.checked;
    if (
      checkboxType === "printed-all" ||
      checkboxType === "pay" ||
      checkboxType === "taken"
    ) {
      e.preventDefault();
      setConfirmAction({
        type: checkboxType as "printed-all" | "pay" | "taken",
        checked,
      });
      setIsConfirmOpen(true);
      // Reset the checkbox state to its previous value to prevent default behavior
      e.target.checked = !checked;
      return;
    }
    if (checkboxType === "printed" && id) {
      handleCheckboxPrintedClick(
        { target: { checked } } as React.ChangeEvent<HTMLInputElement>,
        id,
      );
      return;
    }
    if (checkboxType === "pay") {
      handleCheckboxPayClick(
        { target: { checked } } as React.ChangeEvent<HTMLInputElement>,
      );
      return;
    }
    if (checkboxType === "taken") {
      handleCheckboxTakenClick(
        { target: { checked } } as React.ChangeEvent<HTMLInputElement>,
      );
    }
  };

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

  const handleCheckboxPrintedAllClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const orderDetailIds = (order?.OrderDetails || []).map((od) => od.id);
      if (orderDetailIds.length === 0) return;

      setLoading(true);
      request(
        isChecked
          ? "/orders/detail/print-many"
          : "/orders/detail/cancel-print-many",
        {
          method: "POST",
          body: JSON.stringify(
            isChecked
              ? {
                  orderDetailIds,
                  status: true,
                  printAt: new Date().toISOString(),
                }
              : { orderDetailIds },
          ),
        },
      )
        .then(() => {
          showToast(
            "success",
            isChecked
              ? "Berhasil menandai semua sudah dicetak"
              : "Berhasil membatalkan semua tanda dicetak",
          );
        })
        .catch(() => {
          showToast("error", "Terjadi kesalahan, coba lagi nanti");
        })
        .finally(() => setLoading(false));
    },
    [order?.OrderDetails, request, setLoading],
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
          onCheckBoxPrintedClickHandler={(e, id) =>
            handleCheckboxClick(e, "printed", id)
          }
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
    <div className="flex flex-col gap-6 p-4">
      <BackButton />

      <div className="rounded-2xl border border-gray-700/60 bg-gray-900/70 p-6 text-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Detail Pesanan
            </h3>
            <div className="mt-1 text-sm text-gray-400">
              {order?.number} <span className="mx-2 text-gray-500">•</span>
              {moment(order?.updatedAt).format("DD MMMM YYYY, HH.mm")}
            </div>
          </div>
          {(order?.MarkedPay?.status ||
            order?.MarkedTaken?.status ||
            order?.OrderDetails?.some((od) => od.MarkedPrinted?.status)) && (
            <div className="flex items-center">
              <div className="rounded-full border border-emerald-700/60 bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-300">
                {order && LabelStatus({ order })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-gray-700/60 bg-gray-800/70 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Total Item
            </div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {order?.OrderDetails?.length ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/60 bg-gray-800/70 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Total Qty
            </div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {order?.OrderDetails?.reduce((acc, od) => acc + od.qty, 0) ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/60 bg-gray-800/70 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Status Bayar
            </div>
            <div
              className={twMerge(
                "mt-2 text-lg font-semibold",
                order?.MarkedPay?.status ? "text-emerald-300" : "text-rose-300",
              )}
            >
              {order?.MarkedPay?.status ? "Selesai" : "Belum Dibayar"}
            </div>
            {order?.MarkedPay?.status && order?.MarkedPay?.updatedAt && (
              <div className="mt-1 text-xs text-gray-400">
                {moment(order?.MarkedPay?.updatedAt).format(
                  "DD MMMM YYYY HH.mm",
                )}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-gray-700/60 bg-gray-800/70 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Status Ambil
            </div>
            <div
              className={twMerge(
                "mt-2 text-lg font-semibold",
                order?.MarkedTaken?.status
                  ? "text-emerald-300"
                  : "text-rose-300",
              )}
            >
              {order?.MarkedTaken?.status ? "Selesai" : "Belum Diambil"}
            </div>
            {order?.MarkedTaken?.status && order?.MarkedTaken?.updatedAt && (
              <div className="mt-1 text-xs text-gray-400">
                {moment(order?.MarkedTaken?.updatedAt).format(
                  "DD MMMM YYYY HH.mm",
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-gray-700/60 bg-gray-900/70 p-5 text-gray-200">
          <div className="flex items-center gap-4">
            <UserAvatar
              rounded
              bordered
              size="lg"
              userImage={order?.user?.image}
            ></UserAvatar>
            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-gray-400">
                Dibuat Oleh
              </div>
              <div className="text-lg font-semibold text-white">
                {order?.user?.name}
              </div>
              <div className="text-sm text-gray-400">
                @{order?.user?.username}
              </div>
            </div>
            <div className="mx-4 hidden h-12 w-px bg-gray-700 lg:block" />
            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-gray-400">
                Pelanggan
              </div>
              <div className="text-lg font-semibold text-white">
                {order?.customer || "-"}
              </div>
              <div className="text-sm text-gray-400">
                {order?.description || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700/60 bg-gray-900/70 p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-lg font-semibold text-white">
            Daftar Item Pesanan
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {(isContain(session?.user?.role || "", Roles.ADMIN) ||
              isContain(session?.user?.role || "", Roles.OPERATOR)) && (
              <Label className="flex items-center gap-2">
                <Checkbox
                  onChange={(e) => handleCheckboxClick(e, "printed-all")}
                  checked={
                    order?.OrderDetails?.length
                      ? order.OrderDetails.every(
                          (od) => od.MarkedPrinted?.status,
                        )
                      : false
                  }
                  disabled={order?.MarkedTaken?.status}
                  className="disabled:cursor-not-allowed disabled:text-gray-500"
                />
                Cetak Semua
              </Label>
            )}
            {(isContain(session?.user?.role || "", Roles.ADMIN) ||
              isContain(session?.user?.role || "", Roles.OPERATOR)) &&
              (isContain(session?.user?.role || "", Roles.ADMIN) ||
                isContain(session?.user?.role || "", Roles.ADMINISTRASI)) && (
                <span className="h-4 w-px bg-gray-700" />
              )}
            {(isContain(session?.user?.role || "", Roles.ADMIN) ||
              isContain(session?.user?.role || "", Roles.ADMINISTRASI)) && (
              <>
                <Label className="flex items-center gap-2">
                  <Checkbox
                    onChange={(e) => handleCheckboxClick(e, "pay")}
                    checked={order?.MarkedPay?.status || false}
                  />
                  Dibayar
                </Label>
                <Label className="flex items-center gap-2">
                  <Checkbox
                    onChange={(e) => handleCheckboxClick(e, "taken")}
                    checked={order?.MarkedTaken?.status || false}
                    disabled={
                      !order?.OrderDetails?.every(
                        (od) => od.MarkedPrinted?.status,
                      )
                    }
                  />
                  Diambil
                </Label>
              </>
            )}
          </div>
        </div>
        {table}
      </div>

      {/*
      <ConfirmPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
      */}
      <ConfirmActionModal
        isOpen={isConfirmOpen}
        title={
          confirmAction?.type === "printed-all"
            ? confirmAction?.checked
              ? "Cetak semua item?"
              : "Batalkan cetak semua item?"
            : confirmAction?.type === "pay"
              ? confirmAction?.checked
                ? "Tandai pesanan sebagai dibayar?"
                : "Batalkan status dibayar?"
              : confirmAction?.checked
                ? "Tandai pesanan sebagai diambil?"
                : "Batalkan status diambil?"
        }
        description="Aksi ini akan mengubah status pesanan."
        confirmLabel="Lanjutkan"
        cancelLabel="Batal"
        onClose={() => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === "printed-all") {
            handleCheckboxPrintedAllClick(
              {
                target: { checked: confirmAction.checked },
              } as React.ChangeEvent<HTMLInputElement>,
            );
          } else if (confirmAction.type === "pay") {
            handleCheckboxPayClick(
              {
                target: { checked: confirmAction.checked },
              } as React.ChangeEvent<HTMLInputElement>,
            );
          } else {
            handleCheckboxTakenClick(
              {
                target: { checked: confirmAction.checked },
              } as React.ChangeEvent<HTMLInputElement>,
            );
          }
          setIsConfirmOpen(false);
          setConfirmAction(null);
        }}
      />
    </div>
  );
}
