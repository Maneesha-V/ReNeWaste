import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { extractDateTimeParts, sortByDateDesc } from "../../utils/formatDate";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useSafeSocket } from "../../hooks/useSocket";
import { useAppDispatch } from "../../redux/hooks";
import {
  addNotification,
  fetchNotifications,
  markAsRead,
} from "../../redux/slices/user/userNotificationSlice";
import { UserNotificationPanelProps } from "../../types/common/modalTypes";
import { NotificationResp } from "../../types/notification/notificationTypes";

const NotificationPanel: React.FC<UserNotificationPanelProps> = ({ onClose }) => {
  const userId = localStorage.getItem("user_id") || "";
  console.log("Loaded userId:", userId);
  const dispatch = useAppDispatch();
  const socket = useSafeSocket();

  const notifications = useSelector(
    (state: RootState) => state.userNotifications.notifications
  );
  console.log("notifications", notifications);

  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("joinNotificationRoom", userId);
  }, [socket, userId]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: NotificationResp) => {
      dispatch(addNotification(data));
    };

    socket.on("newNotification", handler);
    return () => {
      socket.off("newNotification", handler);
    };
  }, [socket, dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const filteredNotifications = (
    activeTab === "unread"
      ? [...notifications.filter((n) => !n.isRead)]
      : [...notifications]
  ).sort(sortByDateDesc);

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={onClose} className="text-2xl font-bold">
          &times;
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "unread"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "all"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
      </div>

      <ul className="p-4 space-y-3 overflow-y-auto h-[calc(100%-108px)]">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications</p>
        ) : (
          filteredNotifications.map((n) => {
            const { date, time } = extractDateTimeParts(n.createdAt);
            return (
              <li key={n._id} className="bg-gray-100 p-3 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-800">{n.message}</div>
                  {!n.isRead && (
                    <button
                      className="w-6 h-6 flex items-center justify-center cursor-pointer bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      onClick={() => handleMarkAsRead(n._id)}
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex justify-end space-x-1">
                  <span>{date}</span>
                  <span>{time}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default NotificationPanel;
