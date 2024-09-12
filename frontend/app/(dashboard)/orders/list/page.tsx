"use client";

import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import type { Order } from "@/constants";
import { Roles } from "@/constants";
import {
  COMMON_ERROR_MESSAGE,
  getStartAndEndOfDay,
  isContain,
  showToast,
} from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { useMoment } from "@/lib/useMoment";
import { useOrderWebSocket } from "@/lib/useOrderWebSocket";
import { Button, Modal } from "flowbite-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiCheckCircle,
  HiClipboardList,
  HiClock,
  HiInformationCircle,
} from "react-icons/hi";
import OrderTable from "./_components/OrderTable";

export default function ListOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const { request } = useApiClient();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);
  const [initialOrders, setInitialOrders] = useState<Order[]>([]);
  const orders = useOrderWebSocket(initialOrders, session?.user.id);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const { moment } = useMoment();

  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setIsLoading(true);
    try {
      const { start, end } = getStartAndEndOfDay();
      const url = `/orders/filter?startDate=${start.format()}&endDate=${end.format()}`;
      const { data } = await request(url);
      setInitialOrders(data);
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setIsLoading(false);
  }, [session?.accessToken]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrders();
      fetchedRef.current = true;
    }
  }, [session]);

  const onRemoveHandler = useCallback(async () => {
    try {
      const deletedObject = await request(`/orders/${deleteId}`, {
        method: "DELETE",
      });
      setInitialOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== deletedObject.id),
      );
      showToast(
        "success",
        `Pesanan "${deletedObject.customer}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setOpenModal(false);
  }, [session?.accessToken, deleteId]);

  const calculateUserDesignCounts = () => {
    const counts: { [key: string]: number } = {};
    orders.forEach((order) => {
      // jangan masukkan ke dalam perhitungan jika belum di bayar
      if (!order.MarkedPay?.status) {
        return;
      }
      const user = order.user.name;
      const designCount = order.OrderDetails.reduce(
        (sum, od) => sum + od.design,
        0,
      );

      if (counts[user]) {
        counts[user] += designCount;
      } else {
        counts[user] = designCount;
      }
    });
    return Object.entries(counts).map(([user, totalDesign]) => ({
      user,
      totalDesign,
    }));
  };

  const isAdministrator = useMemo(() => {
    const userRole = session?.user?.role!;
    return (
      isContain(userRole, Roles.ADMIN) ||
      isContain(userRole, Roles.ADMINISTRASI)
    );
  }, [session?.user.role]);

  const calculateOrderStatus = useMemo(() => {
    const total = orders.length;
    const done = orders.filter(
      (order) =>
        order.MarkedPay?.status &&
        order.OrderDetails.every((od) => od.MarkedPrinted?.status) &&
        order.MarkedTaken?.status,
    ).length;
    const onProses =
      orders.filter(
        (order) =>
          order.MarkedPay?.status ||
          (order.OrderDetails.some((od) => od.MarkedPrinted?.status) &&
            !order.MarkedTaken?.status),
      ).length - done;
    return { total, done, onProses };
  }, [orders]);

  const table = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonTable
          columnsName={[
            "User",
            "Nomor",
            "Tanggal",
            "Pelanggan",
            "Keterangan",
            "Status",
            "",
          ]}
        />
      );
    } else {
      return (
        <OrderTable
          order={orders}
          onEditHandler={(id) => router.push(`${pathName}/${id}`)}
          onDetailHandler={(id) => router.push(`${pathName}/detail/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenModal(true);
          }}
          session={session}
        />
      );
    }
  }, [isLoading, orders, pathName, router]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Daftar Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar pesanan{" "}
          <span className="font-semibold">{`${moment(Date.now()).format("dddd")}, ${moment(Date.now()).format("LL")}`}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="shadow-xs flex items-center rounded-lg bg-white p-4 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-orange-100 p-3 text-orange-500 dark:bg-orange-500 dark:text-orange-100">
            <HiClipboardList className="size-5" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Pesanan
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {calculateOrderStatus.total}
            </p>
          </div>
        </div>
        <div className="shadow-xs flex items-center rounded-lg bg-white p-4 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-500 dark:bg-blue-500 dark:text-blue-100">
            <HiClock className="size-5" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              On Proses
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {calculateOrderStatus.onProses}
            </p>
          </div>
        </div>
        <div className="shadow-xs flex items-center rounded-lg bg-white p-4 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-green-100 p-3 text-green-500 dark:bg-green-500 dark:text-green-100">
            <HiCheckCircle className="size-5" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Selesai
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {calculateOrderStatus.done}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="max-w-40">
          {isAdministrator && (
            <Button
              gradientMonochrome="info"
              size={"sm"}
              onClick={() => setShowDesignModal(true)}
            >
              <HiInformationCircle className="mr-2 size-5" />
              Total Design
            </Button>
          )}
        </div>
        <div className="max-w-40">
          <AddButton text="Buat Pesanan" />
        </div>
      </div>
      {table}
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?"
        openModal={openModal}
        onCloseHandler={() => setOpenModal(false)}
        onYesHandler={() => onRemoveHandler()}
      />
      <Modal show={showDesignModal} onClose={() => setShowDesignModal(false)}>
        <Modal.Header>Total Design per User</Modal.Header>
        <Modal.Body>
          <div className="mt-6 space-y-2">
            {calculateUserDesignCounts().map(({ user, totalDesign }) => (
              <div
                key={user}
                className="flex items-center gap-4 dark:text-white"
              >
                <span className="font-medium">{user} :</span>
                <span>{totalDesign}</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDesignModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
