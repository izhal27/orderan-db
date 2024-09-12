import type { Order } from "@/constants";
import { HiCheck, HiClock } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface props {
  order: Order;
  classNameOnProses?: string;
  classNameDone?: string;
}

export default function LabelStatus({
  order,
  classNameOnProses,
  classNameDone,
}: props) {
  let status: React.ReactElement | null = null;
  if (
    order.MarkedPay?.status ||
    order.OrderDetails.some((od) => od.MarkedPrinted?.status) ||
    order.MarkedTaken?.status
  ) {
    status = (
      <span
        className={twMerge(
          "inline-flex w-fit items-center justify-center gap-2 rounded-full bg-gray-500 px-4 py-1 text-base font-semibold text-white dark:bg-gray-400 dark:text-gray-700",
          classNameOnProses,
        )}
      >
        <HiClock className="inline-block" /> ON PROSES
      </span>
    );
  }
  if (
    order.MarkedPay?.status &&
    order?.MarkedTaken?.status &&
    order.OrderDetails.every((od) => od.MarkedPrinted?.status)
  ) {
    status = (
      <span
        className={twMerge(
          "inline-flex w-fit items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-1 text-base font-semibold text-white dark:bg-green-400 dark:text-gray-700",
          classNameDone,
        )}
      >
        <HiCheck className="inline-block" /> SELESAI
      </span>
    );
  }
  return status;
}
