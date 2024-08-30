"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/helpers";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import type { Order } from "@/constants";
import OrderTable from "./_components/Table";
import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import getLocalDate from "@/lib/getLocalDate";

export default function ListOrderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    if (!session) {
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const url = new URL(`http://localhost:3002/api/orders/filter?startDate=${startOfDay}&endDate=${endOfDay}`);
    const searchParams = new URLSearchParams();
    const res = await fetch(`${url}?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    });
    if (res?.ok) {
      const { data } = await res.json();
      setOrders(data);
    } else {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetcCostumers = async () => {
      await fetchOrders();
    };
    if (session) {
      fetcCostumers();
    }
  }, [session]);

  const onRemoveHandler = async () => {
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
  };

  let table = null;
  if (loading) {
    table = (
      <SkeletonTable
        columnsName={["User", "Nomor", "Tanggal", "Pelanggan", "Keterangan", "Status", ""]}
      />
    );
  } else {
    table = (
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
