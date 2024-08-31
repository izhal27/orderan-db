"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import OrderTable from "./_components/Table";
import { Order } from "@/constants";
import { showToast } from "@/helpers";
import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import getLocalDate from "@/lib/getLocalDate";
import { useApiClient } from "@/lib/apiClient";

export default function ListOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const { request } = useApiClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const url = `/orders/filter?startDate=${startOfDay}&endDate=${endOfDay}`;
      const { data } = await request(url);
      setOrders(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrders();
      fetchedRef.current = true;
    }
  }, [session]);

  const onRemoveHandler = useCallback(async () => {
    const res = await fetch(`http://localhost:3002/api/orders/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    if (res.ok) {
      const deletedObject = await res.json();
      await fetchOrders();
      setOpenModal(false);
      showToast(
        "success",
        `Order "${deletedObject.name}" berhasil dihapus.`,
      );
    }
  }, [session?.accessToken, deleteId]);

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={["User", "Nomor", "Tanggal", "Pelanggan", "Keterangan", "Status", ""]}
        />
      );
    } else {
      return (
        <OrderTable
          data={orders}
          onEditHandler={(id) => router.push(`${pathName}/${id}`)}
          onDetailHandler={(id) => router.push(`${pathName}/detail/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenModal(true);
          }}
        />
      );
    }
  }, [loading, orders, pathName, router]);

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
