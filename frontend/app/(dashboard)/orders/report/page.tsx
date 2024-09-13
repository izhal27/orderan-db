"use client";

import ConfirmModal from "@/components/ConfirmModal";
import PaginationTable from "@/components/Pagination";
import SelectInput from "@/components/SelectInput";
import SkeletonTable from "@/components/SkeletonTable";
import type { Order } from "@/constants";
import {
  COMMON_ERROR_MESSAGE,
  formatToEndDateToUTC,
  formatToStartDateToUTC,
  getStartAndEndOfDay,
  showToast,
} from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { Button } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiFilter } from "react-icons/hi";
import type { FilterState } from "../list/_components/FilterModal";
import FilterModal from "../list/_components/FilterModal";
import OrderTable from "../list/_components/OrderTable";

export default function ReportPage() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { request } = useApiClient();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fetchedRef = useRef(false);
  const [savedFilters, setSavedFilters] = useState<FilterState>();

  const handleApplyFilter = useCallback(
    async (filters: FilterState) => {
      setSavedFilters(filters);
      if (!session?.accessToken) {
        return;
      }
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: limit.toString(),
          ...filters,
          startDate: filters.startDate
            ? formatToStartDateToUTC(filters.startDate)
            : "",
          endDate: filters.endDate ? formatToEndDateToUTC(filters.endDate) : "",
        });
        const url = `/orders/filter?${queryParams.toString()}`;
        const {
          data,
          meta: { total, totalPages },
        } = await request(url);
        setOrders(data);
        setTotalData(total);
        setTotalPages(totalPages);
      } catch (error) {
        showToast("error", COMMON_ERROR_MESSAGE);
      }
      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.accessToken, currentPage, limit],
  );

  const fetchOrdersCurrentDate = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setIsLoading(true);
    try {
      const { start, end } = getStartAndEndOfDay();
      const url = `/orders/filter?startDate=${start.format()}&endDate=${end.format()}`;
      const { data } = await request(url);
      setTotalData(data.length);
      setOrders(data);
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setIsLoading(false);
  }, [session?.accessToken, request]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchOrdersCurrentDate();
      fetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    savedFilters && handleApplyFilter(savedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, savedFilters]);

  const onRemoveHandler = useCallback(async () => {
    try {
      const deletedObject = await request(`/orders/${deleteId}`, {
        method: "DELETE",
      });
      setOrders((prevOrders) =>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteId]);

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
          onEditHandler={(id) => router.push(`/orders/list/${id}`)}
          onDetailHandler={(id) => router.push(`/orders/list/detail/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenModal(true);
          }}
          session={session}
          reportMode={true}
        />
      );
    }
  }, [isLoading, orders, router, session]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Laporan Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan pesanan sesuai filter yang diterapkan
        </p>
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
            {`${currentPage * limit - limit + 1} - ${currentPage * limit > totalData ? totalData : currentPage * limit} of ${totalData} items`}
          </span>
        </div>
        <div className="max-w-32">
          <Button size={"sm"} color={"blue"} onClick={() => setIsOpen(true)}>
            <HiFilter className="mr-2 size-5" />
            Filter
          </Button>
        </div>
      </div>
      {table}
      <PaginationTable
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChangeHandler={(page: number) => setCurrentPage(page)}
      />
      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApplyFilter={handleApplyFilter}
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
