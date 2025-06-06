import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import NotificationBadge from "../common/NotificationBadge";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { wastePlantLogout } from "../../redux/slices/wastePlant/wastePlantSlice";
import { useEffect, useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchNotifications } from "../../redux/slices/wastePlant/wastePlantNotificationSlice";
import { MeasureDataPayload } from "../../types/notificationTypes";

type HeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
  isNotifOpen: boolean;
  setIsNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenMeasureWaste: (data: MeasureDataPayload) => void; 
};

const Header = ({ collapsed, toggleCollapse, isNotifOpen, setIsNotifOpen, onOpenMeasureWaste }: HeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const unreadCount = useSelector(
    (state: RootState) =>
      state.wastePlantNotifications.notifications.filter((n) => !n.isRead)
        .length
  );
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const handleLogout = async () => {
    await dispatch(wastePlantLogout());
    navigate("/waste-plant");
  };
  const plantId = sessionStorage.getItem("wasteplant_id") || "";
  console.log("Loaded plantId:", plantId);

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-sm z-10 border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Toggle menu"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setIsNotifOpen(true)} className="relative">
              <NotificationBadge count={unreadCount} />
            </button>
          </div>

          <MessageOutlined
            className="text-xl text-gray-600 cursor-pointer hover:text-green-600"
            onClick={() => navigate("/waste-plant/chat")}
          />

          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                <span className="font-medium">WP</span>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      <NotificationPanel
        visible={isNotifOpen}
        plantId={plantId}
        onClose={() => setIsNotifOpen(false)}
        onOpenMeasureWaste={onOpenMeasureWaste} 
      />
    </header>
  );
};

export default Header;
