'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HiFilter } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import FilterModal from '../list/_components/FilterModal';
import OrderTable from '../list/_components/OrderTable';
import SkeletonTable from '@/components/SkeletonTable';
import SelectInput from '@/components/SelectInput';
import { useApiClient } from '@/lib/apiClient';
import { Order } from '@/constants';
import { COMMON_ERROR_MESSAGE, showToast } from '@/helpers';
import ConfirmModal from '@/components/ConfirmModal';

export default function ReportPage() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathName = usePathname();
  const { request } = useApiClient();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");

  const handleApplyFilter = (filters: any) => {
    setAppliedFilters(filters);
    // Di sini Anda dapat menerapkan filter ke data atau melakukan permintaan API
    console.log('Filter diterapkan:', filters);
  };

  const onRemoveHandler = useCallback(async () => {
    try {
      const deletedObject = await request(`/orders/${deleteId}`, { method: 'DELETE' });
      showToast(
        "success",
        `Pesanan "${deletedObject.customer}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setOpenModal(false);
  }, [session?.accessToken, deleteId]);

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
    <main className="flex flex-col gap-4 p-4"><div>
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
            {`${currentPage * limit - limit + 1} - ${currentPage * limit > totalData ? totalData : currentPage * limit}  of ${totalData} items`}
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