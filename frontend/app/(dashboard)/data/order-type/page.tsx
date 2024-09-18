"use client";

import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import type { OrderType } from "@/constants";
import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrderTypeTable } from "./_components/Table";

export default function JenisPesananPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>();
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const { request } = useApiClient();

  const fetchOrderTypes = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const data = await request("/order-types");
      setOrderTypes(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken, request]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrderTypes();
      fetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const onRemoveHandler = useCallback(async () => {
    try {
      const deletedObject = await request(`/order-types/${deleteId}`, {
        method: "DELETE",
      });
      setOrderTypes((prevState) =>
        prevState.filter((item) => item.id !== deletedObject.id),
      );
      showToast(
        "success",
        `Jenis Pesanan "${deletedObject.name}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", "Gagal menghapus data, coba lagi nanti.");
    }
    setOpenModal(false);
  }, [request, deleteId]);

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={["Nama", "ALamat", "Kontak", "Email", "Keterangan", ""]}
        />
      );
    } else {
      return (
        <OrderTypeTable
          data={orderTypes}
          onEditHandler={(id) => router.push(`${pathName}/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenModal(true);
          }}
        />
      );
    }
  }, [loading, orderTypes, pathName, router]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Jenis Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar jenis pesanan
        </p>
      </div>
      <div className="flex justify-end">
        <div className="max-w-32">
          <AddButton />
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
