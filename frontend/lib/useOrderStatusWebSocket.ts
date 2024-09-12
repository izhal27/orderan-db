import type { Order, WebSocketEvent } from "@/constants";
import useWebSocket from "@/lib/useWebSocket";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useOrderStatusWebSocket(initialOrder: Order | undefined) {
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const { data: session } = useSession();

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const handleOrderStatusChange = useCallback(
    (event: WebSocketEvent, statusType: "Print" | "Pay" | "Taken") => {
      if (session?.user.id === event.userId) {
        return;
      }
      setOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;
        let updatedOrder = { ...prevOrder };
        if (statusType === "Print") {
          const updatedOrderDetails = updatedOrder.OrderDetails.map((detail) =>
            detail.id === event.data.orderDetailId
              ? { ...detail, MarkedPrinted: event.data }
              : detail,
          );
          if (
            updatedOrderDetails.some(
              (detail) => detail.id === event.data.orderDetailId,
            )
          ) {
            updatedOrder = {
              ...updatedOrder,
              OrderDetails: updatedOrderDetails,
              animate: true,
            };
          }
        } else if (statusType === "Pay") {
          if (updatedOrder.id === event.data.orderId) {
            updatedOrder = {
              ...updatedOrder,
              MarkedPay: event.data,
              animate: true,
            };
          }
        } else if (statusType === "Taken") {
          if (updatedOrder.id === event.data.orderId) {
            updatedOrder = {
              ...updatedOrder,
              MarkedTaken: event.data,
              animate: true,
            };
          }
        }
        return updatedOrder;
      });
    },
    [],
  );

  useWebSocket({
    "order:markPrint": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Print"),
    "order:cancelPrint": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Print"),
    "order:markPay": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Pay"),
    "order:cancelPay": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Pay"),
    "order:markTaken": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Taken"),
    "order:cancelTaken": (event: WebSocketEvent) =>
      handleOrderStatusChange(event, "Taken"),
  });

  return { order, setOrder };
}
