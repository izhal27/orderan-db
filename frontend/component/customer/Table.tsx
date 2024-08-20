"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { showToast } from "@/helpers/toast";
import { ConfirmModal } from "../ConfirmModal";
import { Customer } from "@/types/constant";

export function CustomerTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3002/api/customers', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        setCustomers(await res.json());
      }
    }
    if (session) {
      fetchData();
    }
  }, [session]);

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


  return (
    <div>
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
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?" openModal={openModal}
        onCloseHandler={() => setOpenModal(false)}
        onYesHandler={() => onRemoveHandler()} />
    </div>
  );
}
