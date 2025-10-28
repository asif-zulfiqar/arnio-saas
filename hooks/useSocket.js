"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId, onEvent) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // only connect once userId is ready and socket not yet connected
    if (!userId || socketRef.current) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL?.split('/api/')?.[0] || "https://staging.arnio.co", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("event", (data) => {
      console.log("Received event:", data);
      onEvent?.(data);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.off("event"); // remove old listener
    socket.on("event", (data) => onEvent?.(data));
  }, [onEvent]);

  return socketRef;
};
