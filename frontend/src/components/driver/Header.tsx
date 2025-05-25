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
import { driverLogout } from "../../redux/slices/driver/driverSlice";
import { DriverHeaderProps } from "../../types/driverTypes";

const Header = ({ collapsed, toggleCollapse }: DriverHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(driverLogout());
    navigate("/driver");
  };

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
          <NotificationBadge count={5} />
          <MessageOutlined
            className="text-xl text-gray-600 cursor-pointer hover:text-green-600"
            onClick={() => navigate("/driver/chat")}
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
    </header>
  );
};

export default Header;
