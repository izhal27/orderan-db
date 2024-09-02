import { OrderDetail } from "@/constants";
import { Button, Checkbox, Table } from "flowbite-react";
import React, { useState } from "react";
import { HiChevronRight, HiChevronDown } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

interface props {
  data: OrderDetail[];
}

export default function TableShowDetail({ data }: props) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

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
        <Table.HeadCell className="text-center">Dicetak</Table.HeadCell>
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
                  <div className="flex flex-col items-center">
                    <Checkbox id="marked-pay" />
                    <span className="text-xs font-light">Oleh Username</span>
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