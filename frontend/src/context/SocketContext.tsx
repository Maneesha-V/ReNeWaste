import React, { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketProviderProps } from "../types/common/commonTypes";

const SocketContext = createContext<Socket | null>(null);
export { SocketContext };

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
    console.log("Socket URL:", import.meta.env.VITE_SOCKET_URL);
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
