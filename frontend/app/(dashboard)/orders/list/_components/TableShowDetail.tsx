import { Fragment } from "react";
import { Checkbox, Table } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { OrderDetail } from "@/constants";
import localDate from "@/lib/getLocalDate";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";

interface props {
  data: OrderDetail[];
  expandedRowId: string | null,
  onExpandedRowToggleHandler(id: string): void;
  onCheckBoxPrintedClickHandler(e: any, orderDetailId: string): void,
}

export default function TableShowDetail({ data, expandedRowId, onExpandedRowToggleHandler, onCheckBoxPrintedClickHandler }: props) {
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
            <Fragment key={index}>
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
                  <div className="flex items-center justify-center gap-1">
                    <Checkbox
                      id="marked-printed"
                      onClick={(e) => onCheckBoxPrintedClickHandler(e, item.id)}
                      defaultChecked={item.MarkedPrinted?.status} />
                    {
                      item.MarkedPrinted && (
                        <span onClick={() => onExpandedRowToggleHandler(item.id)} color="gray" className="cursor-pointer">
                          {expandedRowId === item.id ? (
                            <HiChevronDown className="h-5 w-5" />
                          ) : (
                            <HiChevronRight className="h-5 w-5" />
                          )}
                        </span>
                      )
                    }
                  </div>
                </Table.Cell>
              </Table.Row>
              {
                item.MarkedPrinted && (
                  <Table.Row>
                    <Table.Cell colSpan={9} className="p-0">
                      <div className={twMerge(expandedRowId === item.id ? 'block' : 'hidden')}>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 ">
                          <div className="text-gray-700 dark:text-gray-300">
                            {
                              item.MarkedPrinted.status ?
                                <span className="text-sm font-light">
                                  {`Ditandai telah dicetak oleh : ${item.MarkedPrinted?.PrintedBy?.name} @${item.MarkedPrinted?.PrintedBy?.username} pada tanggal ${localDate(item.MarkedPrinted?.updatedAt, 'long', true, true)}`}
                                </span> :
                                <span className="text-sm font-light">
                                  {`Ditandai batal cetak oleh : ${item.MarkedPrinted?.PrintedBy?.name} @${item.MarkedPrinted?.PrintedBy?.username} pada tanggal ${localDate(item.MarkedPrinted?.updatedAt, 'long', true, true)}`}
                                </span>
                            }
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              }
            </Fragment>
          );
        })}
      </Table.Body>
    </Table>
  );
}