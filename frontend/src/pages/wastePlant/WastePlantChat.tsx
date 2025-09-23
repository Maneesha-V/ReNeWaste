import React, { useEffect, useState } from "react";
import { List, Typography, Badge, Card } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { fetchDrivers } from "../../redux/slices/wastePlant/wastePlantDriverSlice";
import DriverChatWindow from "../../components/wastePlant/DriverChatWindow";
import usePagination from "../../hooks/usePagination";
import { useSocket } from "../../hooks/useSocket";

const WasteplantChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { driver: drivers } = useSelector((state: RootState) => state.wastePlantDriver);
  const { currentPage, pageSize, search } = usePagination();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

  const wasteplantId = drivers.length > 0 ? drivers[0].wasteplantId : null;

  useEffect(() => {
    dispatch(fetchDrivers({ page: currentPage, limit: pageSize, search  }));
  }, [dispatch, currentPage, pageSize, search]);;

  console.log("drivers",drivers);
  
  useEffect(() => {
    if (!socket) return;

    // Listen for message and update count
    socket.on("receiveMessage", (message) => {
      const { senderId } = message;
      if (!selectedDriver || selectedDriver._id !== senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, selectedDriver]);

  return (
    <div style={{ display: "flex", padding: "24px", gap: "16px" }}>
      <Card style={{ width: "300px", maxHeight: "500px", overflowY: "auto" }} title="Drivers">
        <List
          dataSource={drivers}
          renderItem={(driver:any) => (
            <List.Item onClick={() => {
              setSelectedDriver(driver);
              setUnreadCounts((prev) => ({ ...prev, [driver._id]: 0 }));
            }}>
              <Typography.Text>
                {driver.name || "Unnamed Driver"}
              </Typography.Text>
              {unreadCounts[driver._id] > 0 && (
                <Badge count={unreadCounts[driver._id]} offset={[10, 0]} />
              )}
            </List.Item>
          )}
        />
      </Card>

      <div style={{ flex: 1 }}>
        {selectedDriver ? (
          <DriverChatWindow driver={selectedDriver}  wasteplantId={wasteplantId} />
        ) : (
          <Card><Typography.Text>Select a driver to chat</Typography.Text></Card>
        )}
      </div>
    </div>
  );
};

export default WasteplantChat;
