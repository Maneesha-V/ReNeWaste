import React, { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SocketProviderProps } from "../types/socketTypes";

const SocketContext = createContext<Socket | null>(null);
export { SocketContext };
// interface SocketProviderProps {
//   children: React.ReactNode;
// }

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
    });

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
