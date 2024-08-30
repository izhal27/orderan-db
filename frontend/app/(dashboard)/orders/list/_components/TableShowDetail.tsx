import { OrderDetail } from "@/constants";
import { Button, Table } from "flowbite-react";
import React, { useState } from "react";
import { HiChevronRight, HiChevronDown } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

interface props {
  data: OrderDetail[];
}

export default function TableShowDetail({ data }: props) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  console.log(JSON.stringify(data, null, 4));

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell className="text-center">Nama</Table.HeadCell>
        <Table.HeadCell className="text-center">Lebar</Table.HeadCell>
        <Table.HeadCell className="text-center">Tinggi</Table.HeadCell>
        <Table.HeadCell className="text-center">Qty</Table.HeadCell>
        <Table.HeadCell className="text-center">Design</Table.HeadCell>
        <Table.HeadCell className="text-center">Mata Ayam</Table.HeadCell>
        <Table.HeadCell className="text-center">Shiming</Table.HeadCell>
        <Table.HeadCell className="text-center">Keterangan</Table.HeadCell>
        <Table.HeadCell className="text-center"></Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {data?.map((item: OrderDetail, index) => {
          return (
            <React.Fragment key={index}>
              <Table.Row
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
                  <span onClick={() => toggleRow(item.id)} color="gray" className="cursor-pointer">
                    {expandedRowId === item.id ? (
                      <HiChevronDown className="h-5 w-5" />
                    ) : (
                      <HiChevronRight className="h-5 w-5" />
                    )}
                  </span>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell colSpan={9} className="p-0">
                  <div className={twMerge(expandedRowId === item.id ? 'block' : 'hidden')}>
                    <div className="p-4 bg-gray-200 dark:bg-gray-600 ">
                      <div className="text-gray-600 dark:text-gray-200">
                        {item.name}
                        {item.MarkedPrinted?.status}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>

            </React.Fragment>
          );
        })}
      </Table.Body>
    </Table>
  );
}