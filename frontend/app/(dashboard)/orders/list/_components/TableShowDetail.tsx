import { OrderDetail } from "@/constants";
import { useLoading } from "@/context/LoadingContext";
import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { Checkbox, Table } from "flowbite-react";
import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

interface props {
  data: OrderDetail[];
}

export default function TableShowDetail({ data }: props) {
  const { data: session } = useSession();
  const { request } = useApiClient();
  const { setLoading } = useLoading();

  const sendPostRequest = async (isChecked: boolean, id: string) => {
    setLoading(true);
    try {
      if (isChecked) {
        const data = await request(`/orders/detail/${id}/print`, {
          method: 'POST',
          body: {
            status: true,
            printAt: new Date().toISOString()
          }
        });
        showToast('success', 'Berhasil ditandai sudah dicetak');
      } else {
        await request(`/orders/detail/${id}/cancel-print`, {
          method: 'POST',
          body: {
            status: true,
            printAt: new Date().toISOString()
          }
        });
        showToast('warning', 'Berhasil menghapus tanda sudah dicetak');
      }
    } catch (error) {
      showToast('error', 'Terjadi kesalahan, coba lagi nanti');
    }
    setLoading(false);
  };

  const debouncedPostRequest = useCallback(debounce(sendPostRequest, 500), [session?.accessToken]);

  const handleCheckboxClick = (e: any, id: string) => {
    const isChecked = e.target.checked;
    debouncedPostRequest(isChecked, id);
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
                    <Checkbox
                      id="marked-printed"
                      onClick={(e) => handleCheckboxClick(e, item.id)}
                      defaultChecked={item.MarkedPrinted?.status} />
                    <span className="text-xs font-light">{item.MarkedPrinted?.PrintedBy?.username}</span>
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