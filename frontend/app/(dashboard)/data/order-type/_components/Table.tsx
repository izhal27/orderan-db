"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { showToast } from "@/helpers/toast";
import { ConfirmModal } from "../../../../../components/ConfirmModal";

interface OrderType {
  id: string;
  name: string;
  description: string;
}

export function OrderTypeTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3002/api/order-types', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        setOrderTypes(await res.json());
      }
    }
    if (session) {
      fetchData();
    }
  }, [session]);

  const onRemoveHandler = async () => {
    const res = await fetch(`http://localhost:3002/api/order-types/${deleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    });
    if (res.ok) {
      const deletedObject = await res.json();
      const updatedOrderTypes = orderTypes.filter(item => item.id !== deletedObject.id);
      setOrderTypes(updatedOrderTypes);
      setOpenModal(false);
      showToast('success', `Jenis Pesanan "${deletedObject.name}" berhasil dihapus.`);
    }
  }


  return (
    <div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nama</Table.HeadCell>
          <Table.HeadCell>Keterangan</Table.HeadCell>
          <Table.HeadCell>Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {
            orderTypes?.map((item: any) => {
              return (
                <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </Table.Cell>
                  <Table.Cell className="inline-block">{item.description}</Table.Cell>
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
