import React, { useEffect, useState } from "react";
import { Card, Input, Button, List, Space, Empty } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { addMessage, fetchChatMessages, fetchConversationId } from "../../redux/slices/wastePlant/wastePlantChatSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useSocket } from "../../hooks/useSocket";
import { DriverChatWindowProps } from "../../types/wastePlantTypes";


const DriverChatWindow: React.FC<DriverChatWindowProps> = ({ driver, wasteplantId }) => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { messages, loading } = useSelector((state: RootState) => state.wastePlantChats)
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (driver && wasteplantId) {
      dispatch(fetchConversationId({
        senderId: wasteplantId,
        senderRole: "wasteplant",
        receiverId: driver._id,
        receiverRole: "driver",
      }))
        .unwrap()
        .then((id) => {
          setConversationId(id);
          socket?.emit("joinRoom", id);
          dispatch(fetchChatMessages({ conversationId: id }));
        })
        .catch(console.error);
    }
  }, [driver, wasteplantId, dispatch, socket]);


  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.on("receiveMessage", (message) => {
      if (message.conversationId === conversationId) {
        const sender =
        message.senderId === wasteplantId ? "wasteplant" : "driver";
        dispatch(addMessage({ ...message, sender }));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, conversationId, dispatch]);

  const handleSend = () => {
    if (!input.trim() || !conversationId || !socket) return;

    const newMessage = {
      senderId: wasteplantId,
      receiverId: driver._id,
      text: input.trim(),
      conversationId,
    };

    socket.emit("sendMessage", newMessage);
    // dispatch(
    //     addMessage({
    //       sender: "Wasteplant",
    //       text: input.trim(),
    //       conversationId,
    //     })
    //   );
    setInput("");
  };
  console.log("messages",messages);
  
  return (
    <Card title={`Chat with ${driver.name || "Driver"}`}>
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
                    item.sender === "wasteplant" ? "bg-green-200 ml-auto" : "bg-gray-100 mr-auto"
                  }`}
                  style={{
                    alignSelf: item.sender === "wasteplant" ? "flex-end" : "flex-start",
                  }}
                >
                  <strong>
                    {item.sender === "wasteplant" ? "You" : "Driver" }:
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

export default DriverChatWindow;
