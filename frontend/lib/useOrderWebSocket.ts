import { useState, useEffect, useCallback } from 'react';
import { Order, WebSocketEvent } from "@/constants";
import useWebSocket from "@/lib/useWebSocket";

export function useOrderWebSocket(initialOrders: Order[], sessionUserId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleOrderStatusChange = useCallback((event: WebSocketEvent, statusType: 'Print' | 'Pay' | 'Taken') => {
    setOrders(prevOrders => prevOrders.map(order => {
      let updatedOrder = { ...order };

      if (statusType === 'Print') {
        const updatedOrderDetails = order.OrderDetails.map(detail =>
          detail.id === event.data.orderDetailId ? { ...detail, MarkedPrinted: event.data } : detail
        );
        if (updatedOrderDetails.some(detail => detail.id === event.data.orderDetailId)) {
          updatedOrder = { ...updatedOrder, OrderDetails: updatedOrderDetails, animate: true };
        }
      } else if (statusType === 'Pay') {
        if (order.id === event.data.orderId) {
          updatedOrder = { ...updatedOrder, MarkedPay: event.data, animate: true };
        }
      } else if (statusType === 'Taken') {
        if (order.id === event.data.orderId) {
          updatedOrder = { ...updatedOrder, MarkedTaken: event.data, animate: true };
        }
      }

      return updatedOrder.animate ? updatedOrder : order;
    }));

    setTimeout(() => {
      setOrders(prevOrders => prevOrders.map(order =>
        order.animate ? { ...order, animate: false } : order
      ));
    }, 700);
  }, []);

  useWebSocket({
    "order:new": (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        const newOrder = { ...event.data, animate: true };
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setTimeout(() => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === newOrder.id ? { ...order, animate: false } : order
            )
          );
        }, 700);
      } else {
        setOrders(prevOrders => [event.data, ...prevOrders]);
      }
    },
    "order:update": (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        const updatedOrder = { ...event.data, animate: true };
        setOrders(prevOrders => {
          const filteredOrders = prevOrders.filter(order => order.id !== updatedOrder.id);
          return [updatedOrder, ...filteredOrders];
        });
        setTimeout(() => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === updatedOrder.id ? { ...order, animate: false } : order
            )
          );
        }, 700);
      } else {
        setOrders(prevOrders => {
          const filteredOrders = prevOrders.filter(order => order.id !== event.data.id);
          return [event.data, ...filteredOrders];
        });
      }
    },
    "order:delete": (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== event.data));
      }
    },
    "order:markPrint": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Print'),
    "order:cancelPrint": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Print'),
    "order:markPay": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Pay'),
    "order:cancelPay": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Pay'),
    "order:markTaken": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Taken'),
    "order:cancelTaken": (event: WebSocketEvent) => handleOrderStatusChange(event, 'Taken'),
  });

  return orders;
}
