import React, { useEffect, useState } from "react";
import { useSafeSocket } from "../../hooks/useSocket";
import { useAppDispatch } from "../../redux/hooks";
import { extractDateTimeParts, sortByDateDesc } from "../../utils/formatDate";
import { Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Notification,
} from "../../types/notificationTypes";
import { addNotification, fetchNotifications, markAsRead } from "../../redux/slices/superAdmin/superAdminNotificationSlice";

interface NotificationPanelProps {
  visible: boolean;
  adminId: string;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  visible,
  adminId,
  onClose,
}) => {
  const notifications = useSelector(
    (state: RootState) => state.superAdminNotifications.notifications
  );
 
  const dispatch = useAppDispatch();
  const socket = useSafeSocket();

  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");

  useEffect(() => {
    if (visible && adminId) {
      dispatch(fetchNotifications());
    }
  }, [visible, adminId, dispatch ]);

  useEffect(() => {
    if (!socket || !adminId) return;
    socket.emit("joinNotificationRoom", adminId);
  }, [socket, adminId]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: Notification) => {
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
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
        visible ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
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
          filteredNotifications.map((n, idx) => {

            if (n.createdAt) {
              const { date, time } = extractDateTimeParts(n.createdAt);

              return (
                <li
                  key={n._id || idx}
                  className="bg-gray-100 p-3 rounded space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-800">{n.message}</div>
                    <div className="flex items-center space-x-2">
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
                  </div>
                  <div className="text-xs text-gray-500 flex justify-end space-x-1">
                    <span>{date}</span>
                    <span>{time}</span>
                  </div>
                </li>
              );
            }
            return null;
          })
        )}
      </ul>
    </div>
  );
};

export default NotificationPanel;
