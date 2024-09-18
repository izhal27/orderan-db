"use client";

import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import PaginationTable from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import SelectInput from "@/components/SelectInput";
import SkeletonTable from "@/components/SkeletonTable";
import type { Customer } from "@/constants";
import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomerTable from "./_components/Table";

export default function PelangganPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const fetchedRef = useRef(false);
  const { request } = useApiClient();

  const fetchCustomers = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    const url = `/customers`;
    const searchParams = new URLSearchParams();
    const page = search ? "1" : currentPage.toString();
    searchParams.append("page", page);
    searchParams.append("limit", limit.toString());
    search && searchParams.append("search", search);
    try {
      const { data, total, totalPages } = await request(
        `${url}?${searchParams}`,
      );
      setCustomers(data);
      setTotalData(total);
      setTotalPages(totalPages);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, currentPage, limit, search]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchCustomers();
      fetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, currentPage, limit, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const onRemoveHandler = useCallback(async () => {
    try {
      const url = `/customers/${deleteId}`;
      const deletedObject = await request(`${url}`, {
        method: "DELETE",
        body: "",
      });
      await fetchCustomers();
      showToast(
        "success",
        `Pelanggan "${deletedObject.name}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", "Gagal menghapus data, coba lagi nanti.");
    }
    setOpenModal(false);
  }, [request, deleteId, fetchCustomers]);

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={["Nama", "Alamat", "Kontak", "Email", "Keterangan", ""]}
        />
      );
    } else {
      return (
        <CustomerTable
          data={customers}
          onEditHandler={(id) => router.push(`${pathName}/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenModal(true);
          }}
        />
      );
    }
  }, [loading, customers, pathName, router]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Pelanggan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar pelanggan
        </p>
      </div>
      <div className="flex justify-end">
        <div className="max-w-32">
          <AddButton />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-900 dark:text-white">Items per page</span>
          <SelectInput<number>
            value={limit}
            options={[
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
            onChange={(val) => setLimit(val)}
            className="max-w-fit"
          />
          <span className="text-gray-900 dark:text-white">
            {`${currentPage * limit - limit + 1} - ${currentPage * limit > totalData ? totalData : currentPage * limit}  of ${totalData} items`}
          </span>
        </div>
        <SearchInput
          onSeachHandler={(value) => setSearch(value)}
          onClearHandler={() => {
            setSearch("");
          }}
        />
      </div>
      {table}
      <PaginationTable
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChangeHandler={(page: number) => setCurrentPage(page)}
      />
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?"
        openModal={openModal}
        onCloseHandler={() => setOpenModal(false)}
        onYesHandler={() => onRemoveHandler()}
      />
    </main>
  );
}
