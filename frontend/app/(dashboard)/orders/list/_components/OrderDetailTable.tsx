import type { OrderDetail } from "@/constants";
import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";

interface props {
  data: OrderDetail[];
  detailMode?: boolean;
  onEditHandler(index: number): void;
  onRemoveHandler(index: number): void;
}

export default function OrderDetailTable({
  data,
  onEditHandler,
  onRemoveHandler,
}: props) {
  return (
    <Table className="overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Table.Head className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <Table.HeadCell className="text-left">Nama</Table.HeadCell>
        <Table.HeadCell className="text-center">Lebar</Table.HeadCell>
        <Table.HeadCell className="text-center">Tinggi</Table.HeadCell>
        <Table.HeadCell className="text-center">Qty</Table.HeadCell>
        <Table.HeadCell className="text-center">Design</Table.HeadCell>
        <Table.HeadCell className="text-center">Mata Ayam</Table.HeadCell>
        <Table.HeadCell className="text-center">Shiming</Table.HeadCell>
        <Table.HeadCell className="text-left">Keterangan</Table.HeadCell>
        <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-100 dark:divide-gray-800">
        {data?.map((item: OrderDetail, index) => {
          return (
            <Table.Row
              key={index}
              className="bg-white text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <Table.Cell className="text-left font-medium text-gray-900 dark:text-white">
                {item.name}
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                {item.width}
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                {item.height}
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                {item.qty}
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                {item.design}
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.eyelets
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.eyelets ? "Ya" : "Tidak"}
                </span>
              </Table.Cell>
              <Table.Cell className="text-gray-600 dark:text-gray-300">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.shiming
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.shiming ? "Ya" : "Tidak"}
                </span>
              </Table.Cell>
              <Table.Cell className="text-left text-gray-600 dark:text-gray-300">
                {item.description || "-"}
              </Table.Cell>
              <Table.Cell>
                <div className="flex justify-center gap-2">
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
