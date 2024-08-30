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

export default function JenisPesananPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>();
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchOrderTypes = useCallback(async () => {
    setLoading(true);
    if (!session) {
      return;
    }
    setLoading(true);
    const fetchData = async () => {
      const res = await fetch("http://localhost:3002/api/order-types", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        setOrderTypes(await res.json());
      } else {
        showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
      }
    };
    await fetchData();
    setLoading(false);
  }, []);


  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrderTypes();
      fetchedRef.current = true;
    }
  }, [session]);

  const onRemoveHandler = async () => {
    const res = await fetch(
      `http://localhost:3002/api/order-types/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      },
    );
    if (res.ok) {
      const deletedObject = await res.json();
      const updatedOrderTypes = orderTypes.filter(
        (item) => item.id !== deletedObject.id,
      );
      setOrderTypes(updatedOrderTypes);
      setOpenModal(false);
      showToast(
        "success",
        `Jenis Pesanan "${deletedObject.name}" berhasil dihapus.`,
      );
    }
  };

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
