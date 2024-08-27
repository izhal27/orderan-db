import { OrderDetail } from "@/constants";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: OrderDetail[];
  detailMode?: boolean;
  onEditHandler(index: number): void;
  onRemoveHandler(index: number): void;
}

export default function TableOrderDetail({ data, detailMode = false, onEditHandler, onRemoveHandler }: props) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell className="text-center">Nama</Table.HeadCell>
        <Table.HeadCell className="text-center">Lebar</Table.HeadCell>
        <Table.HeadCell className="text-center">Tinggi</Table.HeadCell>
        <Table.HeadCell className="text-center">Qty</Table.HeadCell>
        <Table.HeadCell className="text-center">Design</Table.HeadCell>
        <Table.HeadCell className="text-center">Mata Ayam</Table.HeadCell>
        <Table.HeadCell className="text-center">Shiming</Table.HeadCell>
        <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
        <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {data?.map((item: OrderDetail, index) => {
          return (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
            >
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.width}</Table.Cell>
              <Table.Cell>{item.height}</Table.Cell>
              <Table.Cell>{item.qty}</Table.Cell>
              <Table.Cell>{item.design}</Table.Cell>
              <Table.Cell>{item.eyelets ? 'Ya' : 'Tidak'}</Table.Cell>
              <Table.Cell>{item.shiming ? 'Ya' : 'Tidak'}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2 justify-center">
                  <HiPencil
                    className="cursor-pointer text-blue-500"
                    onClick={() => onEditHandler(index)}
                  />
                  <HiTrash
                    className="cursor-pointer text-red-500"
                    onClick={() => onRemoveHandler(index)}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}