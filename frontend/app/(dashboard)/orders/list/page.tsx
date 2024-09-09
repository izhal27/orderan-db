"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import moment from 'moment-timezone'
import OrderTable from "./_components/OrderTable";
import { Order, WebSocketEvent } from "@/constants";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers";
import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import getLocalDate from "@/lib/getLocalDate";
import { useApiClient } from "@/lib/apiClient";
import useWebSocket from "@/lib/useWebSocket";
import { useOrderWebSocket } from "@/lib/useOrderWebSocket";

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

  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setIsLoading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var start = moment.tz(timezone).startOf('day').utc();
      var end = moment.tz(timezone).endOf('day').utc();
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
      const deletedObject = await request(`/orders/${deleteId}`, { method: 'DELETE' });
      const index = orders.findIndex(o => o.id === deletedObject.id);
      setInitialOrders(prevOrders => {
        const updatedState = [...prevOrders.toSpliced(index, 1)];
        return updatedState;
      })
      showToast(
        "success",
        `Pesanan "${deletedObject.customer}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setOpenModal(false);
  }, [session?.accessToken, deleteId]);

  const handleOrderStatusChange = (event: WebSocketEvent, statusType: 'Print' | 'Pay' | 'Taken') => {
    setInitialOrders(prevOrders => prevOrders.map(order => {
      let updatedOrder = { ...order };

      if (statusType === 'Print') {
        const updatedOrderDetails = order.OrderDetails.map(detail =>
          detail.id === event.data.orderDetailId ? { ...detail, MarkedPrinted: event.data } : detail
        );
        if (updatedOrderDetails.some(detail => detail.id === event.data.orderDetailId)) {
          updatedOrder = { ...updatedOrder, OrderDetails: updatedOrderDetails, animate: true };
        }
      } else if (statusType === 'Pay') {
        if (order.id === event.data.orderId) {
          updatedOrder = { ...updatedOrder, MarkedPay: event.data, animate: true };
        }
      } else if (statusType === 'Taken') {
        if (order.id === event.data.orderId) {
          updatedOrder = { ...updatedOrder, MarkedTaken: event.data, animate: true };
        }
      }

      return updatedOrder.animate ? updatedOrder : order;
    }));

    setTimeout(() => {
      setInitialOrders(prevOrders => prevOrders.map(order =>
        order.animate ? { ...order, animate: false } : order
      ));
    }, 700);
  };

  const table = useMemo(() => {
    if (isLoading) {
      return (
        <SkeletonTable
          columnsName={["User", "Nomor", "Tanggal", "Pelanggan", "Keterangan", "Status", ""]}
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
          Menampilkan daftar pesanan, <span className="font-semibold">{getLocalDate(Date.now(), 'full')}</span>
        </p>
      </div>
      <div className="flex justify-end">
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
    </main>
  );
}
