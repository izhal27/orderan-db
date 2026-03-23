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
  userRole: string | undefined;
}

export default function ShowDetailOrderTable({
  markedTaken,
  orderDetails,
  expandedRowId,
  onExpandedRowToggleHandler,
  onCheckBoxPrintedClickHandler,
  userRole,
}: props) {
  const { moment } = useMoment();

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
        <Table.HeadCell className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            <span>Dicetak</span>
          </div>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-100 dark:divide-gray-800">
        {orderDetails?.map((item: OrderDetail, index) => {
          return (
            <Fragment key={index}>
              <Table.Row className="bg-white text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
                <Table.Cell className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </div>
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
                  <div className="flex items-center justify-center gap-1">
                    {
                      // jika user bertipe admin atau operator
                      // maka tampilkan checkbox marked printed
                      isContain(userRole || "", Roles.ADMIN) ||
                      isContain(userRole || "", Roles.OPERATOR) ? (
                        <Checkbox
                          id="marked-printed"
                          onChange={(e) =>
                            onCheckBoxPrintedClickHandler(e, item.id)
                          }
                          checked={item.MarkedPrinted?.status}
                          disabled={markedTaken}
                          className="disabled:cursor-not-allowed disabled:text-gray-500"
                        />
                      ) : (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.MarkedPrinted?.status
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                        >
                          {item.MarkedPrinted?.status ? "Sudah" : "Belum"}
                        </span>
                      )
                    }
                    {item.MarkedPrinted && (
                      <button
                        onClick={() => onExpandedRowToggleHandler(item.id)}
                        color="gray"
                        className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
                      <div className="bg-gray-50 px-4 py-3 text-xs dark:bg-gray-800">
                        <div className="text-gray-700 dark:text-gray-200">
                          {item.MarkedPrinted?.status ? (
                            <span className="text-sm font-light">
                              {`Ditandai oleh ${item.MarkedPrinted?.PrintedBy?.username} ${`${moment(item.MarkedPrinted?.updatedAt).format("DD MMMM YYYY HH.mm")}`}`}
                            </span>
                          ) : (
                            <span className="text-sm font-light">
                              {`Dibatalkan oleh ${item.MarkedPrinted?.PrintedBy?.username} ${`${moment(item.MarkedPrinted?.updatedAt).format("DD MMMM YYYY HH.mm")}`}`}
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
