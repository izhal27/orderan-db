import type { Order, WebSocketEvent } from "@/constants";
import useWebSocket from "@/lib/useWebSocket";
import { useCallback, useEffect, useState } from "react";

export function useOrderStatusWebSocket(initialOrder: Order | undefined) {
  const [order, setOrder] = useState<Order | undefined>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const handleOrderStatusChange = useCallback(
    (event: WebSocketEvent, statusType: "Print" | "Pay" | "Taken") => {
      setOrder((prevOrder) => {
        if (!prevOrder) return prevOrder;
        let updatedOrder = { ...prevOrder };
        if (statusType === "Print") {
          const updatedOrderDetails = updatedOrder.OrderDetails.map((detail) =>
            detail.id === event.data.orderDetailId
              ? { ...detail, MarkedPrinted: event.data }
              : detail,
          );
          updatedOrder = {
            ...updatedOrder,
            OrderDetails: updatedOrderDetails,
          };
        } else if (statusType === "Pay") {
          if (updatedOrder.id === event.data.orderId) {
            updatedOrder = {
              ...updatedOrder,
              MarkedPay: event.data,
            };
          }
        } else if (statusType === "Taken") {
          if (updatedOrder.id === event.data.orderId) {
            updatedOrder = {
              ...updatedOrder,
              MarkedTaken: event.data,
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
