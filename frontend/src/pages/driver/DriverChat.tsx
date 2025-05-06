import React, { useState, useEffect } from "react";
import { Input, Button, Card, List, Space, Empty } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useSocket } from "../../context/SocketContext";
import { Message } from "../../types/chatTypes";
import { fetchDriverProfile } from "../../redux/slices/driver/profileDriverSlice";
import { useAppDispatch } from "../../redux/hooks";
import { fetchConversationId } from "../../redux/slices/driver/chatDriverSlice";

const DriverChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const socket = useSocket(); 

   useEffect(() => {
    if (!driver) {
      dispatch(fetchDriverProfile());
    }
  }, [dispatch]);
  useEffect(() => {
    if (driver && driver._id && driver.wasteplantId) {
      dispatch(fetchConversationId({ 
        senderId: driver._id,
        senderRole: "driver", 
        receiverId: driver.wasteplantId,
        receiverRole: "wasteplant" 
      }))
        .unwrap()
        .then((id) => setConversationId(id))
        .catch((err) => console.error("Failed to fetch conversation", err));
    }
  }, [driver, dispatch]);
  
  
useEffect(() => {
    if (!conversationId || !socket) return;

    // Join the room for this driver
    socket.emit("joinRoom", conversationId);

    // Listen for messages from backend
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId, socket]);
console.log("driver",driver);

  const handleSend = () => {
    if (!input.trim() || !conversationId || !socket) return;
    const newMessage = {
      senderId: driver?._id,
      receiverId: driver?.wasteplantId,
      text: input.trim(),
      conversationId,
    };
    socket.emit("sendMessage", newMessage);

    setMessages((prev) => [...prev, { sender: "Driver", text: input.trim() }]);
    setInput("");
  };

  return (
    <Card style={{ margin: "24px", backgroundColor: "#dcf8c6" }}>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "16px",
          padding: "8px",
        }}
      >
        {messages.length === 0 ? (
          <Empty description="No messages yet" />
        ) : (
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ border: "none", padding: "4px 0" }}>
           
              <div
                  className={`max-w-[70%] p-2.5 rounded-xl break-words text-left ${
                    item.sender === "Driver" ? "bg-blue-200 ml-auto" : "bg-yellow-100 mr-auto"
                  }`}
                  style={{
                    alignSelf: item.sender === "Driver" ? "flex-end" : "flex-start",
                  }}
                >
                  <strong>
                    {item.sender === "Driver" ? "You" : "Waste Plant"}:
                  </strong>{" "}
                  {item.text}
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      <Space.Compact style={{ width: "100%" }}>
        <Input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message..."
        />
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </Space.Compact>
    </Card>
  );
};

export default DriverChat;
