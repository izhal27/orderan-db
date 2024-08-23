"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { showToast } from "@/helpers/toast";
import { Customer } from "@/constants/interfaces";
import SkeletonTable from "@/components/SkeletonTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { PaginationTable } from "@/components/Pagination";
import { SelectInput } from "@/components/SelectInput";

export function CustomerTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:3002/api/customers?page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const { data, total, totalPages } = await res.json();
        setCustomers(data);
        setTotalData(total);
        setTotalPages(totalPages);
      }
      setLoading(false);
    }
    if (session) {
      fetchData();
    }
  }, [session, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const onRemoveHandler = async () => {
    const res = await fetch(`http://localhost:3002/api/customers/${deleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    });
    if (res.ok) {
      const deletedObject = await res.json();
      const updatedCustomers = customers.filter(item => item.id !== deletedObject.id);
      setCustomers(updatedCustomers);
      setOpenModal(false);
      showToast('success', `Pelanggan "${deletedObject.name}" berhasil dihapus.`);
    }
  }

  const onPageChange = (page: number) => setCurrentPage(page);

  if (loading) {
    return <SkeletonTable columnsName={['Nama', 'ALamat', 'Kontak', 'Email', 'Keterangan', '']} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span className="text-gray-900 dark:text-white">Items per page</span>
        <SelectInput<number>
          value={limit}
          options={[
            { label: '25', value: 25 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
          ]}
          onChange={(val) => setLimit(val)}
          className="max-w-fit" />
        <span className="text-gray-900 dark:text-white">{`${currentPage * limit - limit + 1} - ${currentPage * limit}  of ${totalData} items`}</span>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nama</Table.HeadCell>
          <Table.HeadCell>Alamat</Table.HeadCell>
          <Table.HeadCell>Kontak</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Keterangan</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {
            customers?.map((item: Customer) => {
              return (
                <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.address}</Table.Cell>
                  <Table.Cell>{item.contact}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      <HiPencil
                        className="cursor-pointer text-blue-500"
                        onClick={() => router.push(`${pathName}/${item.id}`)}
                      />
                      <HiTrash
                        className="ml-2 cursor-pointer text-red-500"
                        onClick={() => {
                          setDeleteId(item.id);
                          setOpenModal(true);
                        }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </Table>
      <PaginationTable currentPage={currentPage} totalPages={totalPages} onPageChangeHandler={onPageChange} />
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?" openModal={openModal}
        onCloseHandler={() => setOpenModal(false)}
        onYesHandler={() => onRemoveHandler()} />
    </div>
  );
}
