"use client";

import { Button, Table } from "flowbite-react";
import { useState } from "react";
import { HiDocumentAdd, HiPencil, HiTrash } from "react-icons/hi";
import ModalInput from "./ModalInput";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";

type OrderType = {
  id: string,
  name: string;
  description: string;
}

interface props {
  data: OrderType[]
}

export function JenisPesananTable({ data }: props) {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const { data: session } = useSession();

  const onSaveHandler = async (result: any) => {
    data.push(result);
    setOpenModal(false);
  };

  function openModalHandler() {
    setError(null);
    setOpenModal(prevState => !prevState);
  }

  return (
    <div>
      <ModalInput
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSaveHandler={onSaveHandler}
        error={error}
      />
      <div className="flex flex-col gap-y-3">
        <div>
          <Button size={"sm"} color={"blue"} onClick={() => openModalHandler()}>
            <HiDocumentAdd className="mr-2 size-5" />
            Tambah
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Nama</Table.HeadCell>
            <Table.HeadCell>Keterangan</Table.HeadCell>
            <Table.HeadCell>Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              data?.map((item: any) => {
                return (
                  <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="inline-block">{item.description}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-x-1">
                        <HiPencil
                          className="cursor-pointer text-blue-500"
                          onClick={() => console.log("Item 1")}
                        />
                        <HiTrash
                          className="ml-2 cursor-pointer text-red-500"
                          onClick={() => console.log("Item 1")}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
