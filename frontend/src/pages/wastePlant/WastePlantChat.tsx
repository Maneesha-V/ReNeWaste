// import React, { useState, useEffect } from "react";
// import { Input, Button, Card, List, Space, Empty, Layout, Typography } from "antd";
// import { useSocket } from "../../context/SocketContext";
// import { Message } from "../../types/chatTypes";
// import { useAppDispatch } from "../../redux/hooks";
// import { RootState } from "../../redux/store";
// import { useSelector } from "react-redux";
// import { fetchDrivers } from "../../redux/slices/wastePlant/wastePlantDriverSlice";
// import { fetchConversationId } from "../../redux/slices/wastePlant/wastePlantChatSlice";

// const { Sider, Content } = Layout;
// const { Title } = Typography;

// const WastePlantChat: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
//     []
//   );
//     const { driver: drivers , loading, error } = useSelector((state: RootState) => state.wastePlantDriver);
//     const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
//     const [conversationId, setConversationId] = useState<string | null>(null);
//     const [input, setInput] = useState("");

//   const socket = useSocket(); 
  
//   useEffect(() => {
//     dispatch(fetchDrivers());
//   }, [dispatch]);;
// console.log("drivers",drivers);

//   useEffect(() => {
//     if (selectedDriverId) {
//       const selectedDriver = drivers.find((d: any) => d._id === selectedDriverId);
//       if (!selectedDriver) return;
//       dispatch(
//         fetchConversationId({
//           senderId: selectedDriver.wasteplantId, // replace with actual ID from logged in user
//           senderRole: "wasteplant",
//           receiverId: selectedDriverId,
//           receiverRole: "driver",
//         })
//       )
//         .unwrap()
//         .then((id) => setConversationId(id))
//         .catch((err) => console.error("Failed to fetch conversation", err));
//     }
//   }, [selectedDriverId, drivers, dispatch]);

// useEffect(() => {
//     if (!conversationId || !socket) return;

//     // Join the room for this driver
//     socket.emit("joinRoom", conversationId);

//     // Listen for messages from backend
//     socket.on("receiveMessage", (message: Message) => {
//       setMessages((prev) => [...prev, message]);
//     });


//     // Clean up on unmount
//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [conversationId, socket]);


//   const handleSend = () => {
//     if (!input.trim() || !conversationId || !socket || !selectedDriverId) return;
//     const newMessage = {
//         sender: "wasteplant",
//         receiverId: selectedDriverId,
//         text: input.trim(),
//         conversationId,
//       };
//     socket.emit("sendMessage", newMessage);

//     setMessages((prev) => [...prev, { sender: "Wasteplant", text: input.trim() }]);
//     setInput("");
//   };

//   return (
//     <Layout style={{ height: "50vh", border: "1px solid #ddd", margin: 24 }}>
//     {/* Sidebar: Drivers List */}
//     <Sider width={250} style={{ background: "#dcf8c6", padding: "16px", overflowY: "auto" }}>
//       {/* <Title level={4}>All</Title> */}
//       <List
//         dataSource={drivers}
//         loading={loading}
//         renderItem={(drv: any) => (
//           <List.Item
//             key={drv._id}
//             style={{
//               padding: "8px",
//               cursor: "pointer",
//               backgroundColor: selectedDriverId === drv._id ? "#d9f7be" : "transparent",
//               borderRadius: 6,
//             }}
//             onClick={() => setSelectedDriverId(drv._id)}
//           >
//             <div>
//               <strong>{drv.name}</strong>
//               <div style={{ fontSize: 12, color: "#888" }}>{drv.email}</div>
//             </div>
//           </List.Item>
//         )}
//       />
//     </Sider>

//     {/* Main Chat Area */}
//     <Content style={{ padding: "16px", backgroundColor: "#fff", display: "flex", flexDirection: "column", height: "100%" }}>
//       {selectedDriverId ? (
//         <>
//           <Title level={4}>Chat with Driver</Title>
//           <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: "16px", padding: "8px" }}>
//             {messages.length === 0 ? (
//               <Empty description="No messages yet" />
//             ) : (
//               <List
//                 dataSource={messages}
//                 renderItem={(item, index) => (
//                   <List.Item key={index}>
//                     <div
//                       className={`max-w-[70%] p-2.5 rounded-xl break-words text-left ${
//                         item.sender === "driver" ? "bg-blue-200 ml-auto" : "bg-yellow-100 mr-auto"
//                       }`}
//                     >
//                       <strong>
//                         {item.sender === "driver" ? "Driver" : "Waste Plant"}:
//                       </strong>{" "}
//                       {item.text}
//                     </div>
//                   </List.Item>
//                 )}
//               />
//             )}
//           </div>

//           <Space.Compact style={{ width: "100%" }}>
//             <Input
//               style={{ flex: 1 }}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onPressEnter={handleSend}
//               placeholder="Type a message..."
//             />
//             <Button type="primary" onClick={handleSend}>
//               Send
//             </Button>
//           </Space.Compact>
//         </>
//       ) : (
//         <Empty description="Select a driver to start chatting" />
//       )}
//     </Content>
//   </Layout>

//   );
// };

// export default WastePlantChat;
import React, { useEffect, useState } from "react";
import { List, Typography, Badge, Card } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { fetchDrivers } from "../../redux/slices/wastePlant/wastePlantDriverSlice";
import DriverChatWindow from "../../components/wastePlant/DriverChatWindow";
import { useSocket } from "../../context/SocketContext";

const WasteplantChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { driver: drivers } = useSelector((state: RootState) => state.wastePlantDriver);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

  const wasteplantId = drivers.length > 0 ? drivers[0].wasteplantId : null;

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);;
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
