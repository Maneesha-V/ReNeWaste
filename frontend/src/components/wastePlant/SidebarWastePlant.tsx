import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  InboxOutlined,
  ShoppingOutlined,
  AimOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { SidebarWastePlantProps } from "../../types/common/modalTypes";

const SidebarWastePlant = ({
  collapsed,
  isNotifOpen,
}: SidebarWastePlantProps) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/waste-plant/dashboard",
    },
    {
      key: "pickups",
      icon: <InboxOutlined />,
      label: "Pickups",
      path: "/waste-plant/pickups",
    },
    {
      key: "drivers",
      icon: <TeamOutlined />,
      label: "Drivers",
      path: "/waste-plant/drivers",
    },
    {
      key: "trucks",
      icon: <CarOutlined />,
      label: "Trucks",
      path: "/waste-plant/trucks",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      path: "/waste-plant/users",
    },
    {
      key: "drop-spots",
      icon: <AimOutlined />,
      label: "Drop Spots",
      path: "/waste-plant/drop-spots",
    },
    {
      key: "waste-reports",
      icon: <FileTextOutlined />,
      label: "Waste Reports",
      path: "/waste-plant/waste-reports",
    },
    {
      key: "pay-earn",
      icon: <DollarOutlined />,
      label: "Payments",
      path: "/waste-plant/payment",
    },
    {
      key: "subscription",
      icon: <ShoppingOutlined />,
      label: "Subscription",
      path: "/waste-plant/subscription-plan",
    },
    {
      key: "wallet",
      icon: <WalletOutlined />,
      label: "Wallet",
      path: "/waste-plant/wallet",
    },
    
  ];

  const handleClick = (
    path: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (isNotifOpen) {
      event.preventDefault();
      toast.info("Please close notifications before navigating.");
      return;
    }
    navigate(path);
  };

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-start border-b border-green-700 px-3">
        <button onClick={() => navigate("/waste-plant/profile")}>
          <FaUserCircle className="w-8 h-8 cursor-pointer hover:text-green-600" />
        </button>
        {!collapsed && (
          <h2 className="text-white font-semibold text-xl ml-3">Waste Plant</h2>
        )}
        {collapsed && (
          <h2 className="text-white font-semibold text-lg ml-2">WP</h2>
        )}
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.path}
                onClick={(e) => handleClick(item.path, e)}
                className={`flex items-center p-3 rounded-lg transition-colors w-full ${
                  window.location.pathname === item.path
                    ? "bg-green-700 text-white"
                    : "text-green-100 hover:bg-green-700 hover:bg-opacity-50"
                }`}
              >
                <span className="flex-shrink-0 text-lg">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarWastePlant;
