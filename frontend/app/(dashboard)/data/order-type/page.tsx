'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { OrderTypeTable } from "./_components/Table";
import AddButton from "@/components/buttons/AddButton";
import SkeletonTable from "@/components/SkeletonTable";
import { OrderType } from "@/constants";
import { showToast } from "@/helpers";
import ConfirmModal from "@/components/ConfirmModal";
import { useApiClient } from "@/lib/apiClient";

export default function JenisPesananPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>();
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const { request } = useApiClient()

  const fetchOrderTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request('/order-types');
      setOrderTypes(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrderTypes();
      fetchedRef.current = true;
    }
  }, [session]);

  const onRemoveHandler = useCallback(async () => {
    try {
      const url = `/order-types/${deleteId}`;
      const deletedObject = await request(`${url}`, { method: "DELETE", body: "" });
      setOrderTypes(prevState => prevState.filter(
        (item) => item.id !== deletedObject.id,
      ));
      showToast(
        "success",
        `Jenis Pesanan "${deletedObject.name}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", "Gagal menghapus data, coba lagi nanti.");
    }
    setOpenModal(false);
  }, [session?.accessToken, deleteId]);

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
