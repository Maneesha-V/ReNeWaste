import React, { useState, useEffect } from "react";
import { Input, Button, Card, List, Space, Empty } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const DriverChat: React.FC = () => {
  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  useEffect(() => {
    // Simulate loading initial messages
    setMessages([
      { sender: "WastePlant", text: "Hello, driver!" },
      { sender: "Driver", text: "Hi! I need assistance." },
    ]);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      sender: "Driver",
      text: input.trim(),
    };
    setMessages([...messages, newMessage]);
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
                {/* <div
                  style={{
                    maxWidth: '70%',
                    marginLeft: item.sender === "Driver" ? "auto" : 0,
                    marginRight: item.sender === "WastePlant" ? "auto" : 0,
                    backgroundColor: item.sender === "Driver" ? "#bae7ff" : "#fffbe6",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    alignSelf: item.sender === "Driver" ? "flex-end" : "flex-start",
                    textAlign: "left",
                    wordBreak: "break-word",
                  }}
                > */}
       <div
  className={`max-w-[70%] p-2.5 rounded-xl break-words text-left
    ${item.sender === "Driver" ? "bg-blue-200 ml-auto" : "bg-yellow-100 mr-auto"}`}
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
