
"use client";

import { Button, Table } from "flowbite-react";
import { useState } from "react";
import { HiDocumentAdd, HiPencil, HiTrash } from "react-icons/hi";
import ModalInput from "./ModalInput";

export function JenisPesananTable() {
  const [openModal, setOpenModal] = useState(false);

  const onSaveHandler = ({ name, description }: { name: string, description: string }) => {
    console.log(`${name} : ${description}`);
    setOpenModal(prevState => !prevState);
  }

  return (
    <div>
      <ModalInput openModal={openModal} setOpenModal={setOpenModal} onSaveHandler={onSaveHandler} />
      <div className="flex flex-col gap-y-3">
        <div>
          <Button size={'sm'} color={'blue'} onClick={() => setOpenModal(true)}>
            <HiDocumentAdd className="mr-2 h-5 w-5" />
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
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>
                <div className="flex gap-x-1">
                  <HiPencil
                    className="text-blue-500 cursor-pointer"
                    onClick={() => console.log('Item 1')}
                  />
                  <HiTrash
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => console.log('Item 1')}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'ASUS TUF Gaming A14 (2024)'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>
                <div className="flex gap-x-1">
                  <HiPencil
                    className="text-blue-500 cursor-pointer"
                    onClick={() => console.log('Item 1')}
                  />
                  <HiTrash
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => console.log('Item 1')}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
