import type { WebSocketEvent } from "@/constants";
import useWebSocket from "@/lib/useWebSocket";
import { useCallback, useEffect, useState } from "react";

export function useGenericWebSocket<T extends { id: string }>(
  initialItems: T[],
  sessionUserId: string | undefined,
  eventPrefix: string,
) {
  const [items, setItems] = useState<T[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleStatusChange = useCallback(
    (event: WebSocketEvent, statusType: string) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          let updatedItem = { ...item } as T & { animate?: boolean };

          if (item.id === event.data.id) {
            updatedItem = {
              ...updatedItem,
              [statusType]: event.data,
              animate: true,
            };
          }

          return updatedItem.animate ? updatedItem : item;
        }),
      );

      setTimeout(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            "animate" in item ? { ...item, animate: false } : item,
          ),
        );
      }, 700);
    },
    [],
  );

  useWebSocket({
    [`${eventPrefix}:new`]: (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        const newItem = { ...event.data, animate: true } as T & {
          animate: boolean;
        };
        setItems((prevItems) => [newItem, ...prevItems]);
        setTimeout(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === newItem.id ? { ...item, animate: false } : item,
            ),
          );
        }, 700);
      } else {
        setItems((prevItems) => [event.data, ...prevItems]);
      }
    },
    [`${eventPrefix}:update`]: (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        const updatedItem = { ...event.data, animate: true } as T & {
          animate: boolean;
        };
        setItems((prevItems) => {
          const filteredItems = prevItems.filter(
            (item) => item.id !== updatedItem.id,
          );
          return [updatedItem, ...filteredItems];
        });
        setTimeout(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === updatedItem.id ? { ...item, animate: false } : item,
            ),
          );
        }, 700);
      } else {
        setItems((prevItems) => {
          const filteredItems = prevItems.filter(
            (item) => item.id !== event.data.id,
          );
          return [event.data, ...filteredItems];
        });
      }
    },
    [`${eventPrefix}:delete`]: (event: WebSocketEvent) => {
      if (event.userId !== sessionUserId) {
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== event.data),
        );
      }
    },
    [`${eventPrefix}:markPrint`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Print"),
    [`${eventPrefix}:cancelPrint`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Print"),
    [`${eventPrefix}:markPay`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Pay"),
    [`${eventPrefix}:cancelPay`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Pay"),
    [`${eventPrefix}:markTaken`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Taken"),
    [`${eventPrefix}:cancelTaken`]: (event: WebSocketEvent) =>
      handleStatusChange(event, "Taken"),
  });

  return items;
}
