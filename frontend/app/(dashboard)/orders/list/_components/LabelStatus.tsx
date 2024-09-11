import { Order } from "@/constants";
import { HiCheck, HiClock } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface props {
  order: Order;
  classNameOnProses?: string;
  classNameDone?: string;
}

export default function LabelStatus({ order, classNameOnProses, classNameDone }: props) {
  let status: any = null;
  if ((order.MarkedPay?.status || order.OrderDetails.some(od => od.MarkedPrinted?.status) || order.MarkedTaken?.status)) {
    status = <span
      className={twMerge("px-4 py-1 bg-gray-500 dark:bg-gray-400 rounded-full text-white dark:text-gray-700 text-base font-semibold inline-flex items-center justify-center w-fit gap-2", classNameOnProses)}
    >
      <HiClock className="inline-block" /> ON PROSES
    </span>
  }
  if (order.MarkedPay?.status && order?.MarkedTaken?.status && order.OrderDetails.every(od => od.MarkedPrinted?.status)) {
    status = <span
      className={twMerge("px-4 py-1 bg-green-500 dark:bg-green-400 rounded-full text-white dark:text-gray-700 text-base font-semibold inline-flex items-center justify-center w-fit gap-2", classNameDone)}
    >
      <HiCheck className="inline-block" /> SELESAI
    </span>
  }
  return status;
}