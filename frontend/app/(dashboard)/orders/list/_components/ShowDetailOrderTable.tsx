import type { OrderDetail } from "@/constants";
import { Roles } from "@/constants";
import { isContain } from "@/helpers";
import { useMoment } from "@/lib/useMoment";
import { Checkbox, Table } from "flowbite-react";
import { Fragment } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";

interface props {
  markedTaken?: boolean;
  orderDetails: OrderDetail[];
  expandedRowId: string | null;
  onExpandedRowToggleHandler(id: string): void;
  onCheckBoxPrintedClickHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    orderDetailId: string,
  ): void;
  role: string | undefined;
}

export default function ShowDetailOrderTable({
  markedTaken,
  orderDetails,
  expandedRowId,
  onExpandedRowToggleHandler,
  onCheckBoxPrintedClickHandler,
  role,
}: props) {
  const { moment } = useMoment();

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
        {orderDetails?.map((item: OrderDetail, index) => {
          return (
            <Fragment key={index}>
              <Table.Row className="bg-white text-center dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.width}</Table.Cell>
                <Table.Cell>{item.height}</Table.Cell>
                <Table.Cell>{item.qty}</Table.Cell>
                <Table.Cell>{item.design}</Table.Cell>
                <Table.Cell>{item.eyelets ? "Ya" : "Tidak"}</Table.Cell>
                <Table.Cell>{item.shiming ? "Ya" : "Tidak"}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    {
                      // jika user bertipe admin atau operator
                      // maka tampilkan checkbox marked printed
                      isContain(role || "", Roles.ADMIN) ||
                      isContain(role || "", Roles.OPERATOR) ? (
                        <Checkbox
                          id="marked-printed"
                          onChange={(e) =>
                            onCheckBoxPrintedClickHandler(e, item.id)
                          }
                          checked={item.MarkedPrinted?.status || false}
                          disabled={markedTaken}
                          className="disabled:cursor-not-allowed disabled:text-gray-500"
                        />
                      ) : (
                        <span>
                          {item.MarkedPrinted?.status ? "Sudah" : "Belum"}
                        </span>
                      )
                    }
                    {item.MarkedPrinted && (
                      <button
                        onClick={() => onExpandedRowToggleHandler(item.id)}
                        color="gray"
                        className="cursor-pointer"
                      >
                        {expandedRowId === item.id ? (
                          <HiChevronDown className="size-5" />
                        ) : (
                          <HiChevronRight className="size-5" />
                        )}
                      </button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
              {item.MarkedPrinted && (
                <Table.Row>
                  <Table.Cell colSpan={9} className="p-0">
                    <div
                      className={expandedRowId === item.id ? "block" : "hidden"}
                    >
                      <div className="bg-gray-100 p-4 dark:bg-gray-700 ">
                        <div className="text-gray-700 dark:text-gray-300">
                          {item.MarkedPrinted.status ? (
                            <span className="text-sm font-light">
                              {`Ditandai dicetak oleh : ${item.MarkedPrinted?.PrintedBy?.name} @${item.MarkedPrinted?.PrintedBy?.username} pada tanggal ${`${moment(Date.now()).format("LLLL")}`}`}
                            </span>
                          ) : (
                            <span className="text-sm font-light">
                              {`Dibatalkan oleh : ${item.MarkedPrinted?.PrintedBy?.name} @${item.MarkedPrinted?.PrintedBy?.username} pada tanggal ${`${moment(Date.now()).format("LLLL")}`}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Fragment>
          );
        })}
      </Table.Body>
    </Table>
  );
}
