"use client";

import { useEffect, useState } from "react";
import AddButton from "@/components/buttons/AddButton";
import type { Customer } from "@/constants";
import { showToast } from "@/helpers";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import CustomerTable from "./_components/Table";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import SelectInput from "@/components/SelectInput";
import SearchInput from "@/components/SearchInput";
import PaginationTable from "@/components/Pagination";

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

  const fetchCustomers = async () => {
    setLoading(true);
    if (!session) {
      return;
    }
    const url = new URL(`http://localhost:3002/api/customers`);
    const searchParams = new URLSearchParams();
    const page = search ? "1" : currentPage.toString();
    searchParams.append("page", page);
    searchParams.append("limit", limit.toString());
    search && searchParams.append("search", search);
    const res = await fetch(`${url}?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    });
    if (res?.ok) {
      const { data, total, totalPages } = await res.json();
      setCustomers(data);
      setTotalData(total);
      setTotalPages(totalPages);
    } else {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetcCostumers = async () => {
      await fetchCustomers();
    };
    if (session) {
      fetcCostumers();
    }
  }, [session, currentPage, limit, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const onRemoveHandler = async () => {
    const res = await fetch(`http://localhost:3002/api/customers/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    if (res.ok) {
      const deletedObject = await res.json();
      await fetchCustomers();
      setOpenModal(false);
      showToast(
        "success",
        `Pelanggan "${deletedObject.name}" berhasil dihapus.`,
      );
    }
  };

  let table = null;
  if (loading) {
    table = (
      <SkeletonTable
        columnsName={["Nama", "ALamat", "Kontak", "Email", "Keterangan", ""]}
      />
    );
  } else {
    table = (
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
