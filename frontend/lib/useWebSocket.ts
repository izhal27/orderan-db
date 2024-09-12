import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler<T = any> = (data: T) => void;
type EventMap = Record<string, EventHandler>;

const useWebSocket = (events: EventMap) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3002",
    );

    // Subscribe to all events
    Object.entries(events).forEach(([event, handler]) => {
      socketRef.current?.on(event, handler);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        Object.keys(events).forEach((event) => {
          socketRef.current?.off(event);
        });
        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }
      }
    };
  }, [events]);

  return socketRef.current;
};

export default useWebSocket;
