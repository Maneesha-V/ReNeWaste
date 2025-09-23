import React, { useState, useEffect } from "react";
import { Input, Button, Card, List, Space, Empty } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchDriverProfile } from "../../redux/slices/driver/profileDriverSlice";
import { useAppDispatch } from "../../redux/hooks";
import {
  addMessage,
  fetchChatMessages,
  fetchConversationId,
} from "../../redux/slices/driver/chatDriverSlice";
import { useSocket } from "../../hooks/useSocket";

const DriverChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const { messages } = useSelector((state: RootState) => state.driverChats)

  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const socket = useSocket();

  useEffect(() => {
    if (!driver) {
      dispatch(fetchDriverProfile());
    }
  }, [driver, dispatch]);

  useEffect(() => {
    if (driver && driver._id && driver.wasteplantId) {
      dispatch(
        fetchConversationId({
          senderId: driver._id,
          senderRole: "driver",
          receiverId: driver.wasteplantId,
          receiverRole: "wasteplant",
        })
      )
        .unwrap()
        .then((res) => {
          setConversationId(res.conversationId);
          socket?.emit("joinChatRoom", res.conversationId);
          dispatch(fetchChatMessages({ conversationId: res.conversationId }));
        })
        .catch(console.error);
    }
  }, [driver, dispatch, socket]);

  useEffect(() => {
    if (!conversationId || !socket) return;
socket.on("receiveMessage", (message) => {
      if (message.conversationId === conversationId) {
        const sender =
        message.senderId === driver?._id ? "driver" : "wasteplant";
        dispatch(addMessage({ ...message, sender }));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId, socket, dispatch]);
  console.log("driver", driver);
  console.log("messages", messages);
  const handleSend = () => {
    if (!input.trim() || !conversationId || !socket) return;
    const newMessage = {
      senderId: driver?._id,
      receiverId: driver?.wasteplantId,
      text: input.trim(),
      conversationId,
    };
    socket.emit("sendMessage", newMessage);

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
                    item.sender === "driver"
                      ? "bg-blue-200 ml-auto"
                      : "bg-yellow-100 mr-auto"
                  }`}
                  style={{
                    alignSelf:
                    item.sender === "driver" ? "flex-end" : "flex-start",
                  }}
                >
                  <strong>
                    {item.sender === "driver" ? "You" : "Waste Plant"}:
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
