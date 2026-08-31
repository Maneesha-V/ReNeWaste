import React, { useEffect, useState } from "react";
import {
  List,
  Typography,
  Badge,
  Card,
  Avatar,
  Input,
  Empty,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { fetchDrivers } from "../../redux/slices/wastePlant/wastePlantDriverSlice";
import DriverChatWindow from "../../components/wastePlant/DriverChatWindow";
import usePagination from "../../hooks/usePagination";
import { useSocket } from "../../hooks/useSocket";
import "../../WastePlantChat.css";
import { DriverDTO } from "../../types/driver/driverTypes";

const WasteplantChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const { drivers } = useSelector(
    (state: RootState) => state.wastePlantDriver
  );
  console.log("drivers",drivers);
  
  const { currentPage, pageSize, search } = usePagination();

  const [selectedDriver, setSelectedDriver] = useState<DriverDTO | null>(null);
  const [driverSearch, setDriverSearch] = useState("");

  const [unreadCounts, setUnreadCounts] = useState<{
    [key: string]: number;
  }>({});

  // const wasteplantId =
  //   drivers.length > 0 ? drivers[0].wasteplantId : null;
  const wasteplantId = drivers[0]?.wasteplantId;
  useEffect(() => {
    dispatch(
      fetchDrivers({
        page: currentPage,
        limit: pageSize,
        search,
      })
    );
  }, [dispatch, currentPage, pageSize, search]);

  useEffect(() => {
    if (!socket) return;

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

  const filteredDrivers = drivers.filter((driver: DriverDTO) =>
    driver.name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  return (
    <div className="chat-layout">

      {/* Sidebar */}

      <Card className="driver-sidebar" bordered={false}>
        <div className="sidebar-header">
          Drivers
        </div>

        <div className="driver-search">
          <Input
            placeholder="Search Driver..."
            prefix={<SearchOutlined />}
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
          />
        </div>

        <List
          dataSource={filteredDrivers}
          renderItem={(driver: DriverDTO) => (
            <List.Item
              className={`driver-item ${
                selectedDriver?._id === driver._id ? "active-driver" : ""
              }`}
              onClick={() => {
                setSelectedDriver(driver);

                setUnreadCounts((prev) => ({
                  ...prev,
                  [driver._id]: 0,
                }));
              }}
            >
              <div className="driver-info">

                <Avatar
                  size={48}
                  style={{
                    background: "#25D366",
                  }}
                  icon={<UserOutlined />}
                />

                <div className="driver-text">
                  <Typography.Text strong>
                    {driver.name}
                  </Typography.Text>

                  <Typography.Text type="secondary">
                    Driver
                  </Typography.Text>
                </div>
              </div>

              {unreadCounts[driver._id] > 0 && (
                <Badge count={unreadCounts[driver._id]} />
              )}
            </List.Item>
          )}
        />
      </Card>

      {/* Chat Area */}

      <div className="chat-section">

        {selectedDriver ? (
          <>
            <div className="chat-header">

              <Avatar
                style={{
                  background: "#25D366",
                }}
                size={42}
              >
                {selectedDriver.name.charAt(0)}
              </Avatar>

              <div>
                <Typography.Title
                  level={5}
                  style={{
                    color: "white",
                    marginBottom: 0,
                  }}
                >
                  {selectedDriver.name}
                </Typography.Title>

                <Typography.Text
                  style={{
                    color: "#e8f5e9",
                  }}
                >
                  Driver
                </Typography.Text>
              </div>
            </div>
            {wasteplantId && (
            <DriverChatWindow
              driver={selectedDriver}
              wasteplantId={wasteplantId}
            />
            )}

          </>
        ) : (
          <Card className="empty-chat">
            <Empty
              description="Select a driver to start chatting"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default WasteplantChat;