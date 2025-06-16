import { NavLink, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { AdminSidebarProps } from "../../types/adminTypes";
import { toast } from "react-toastify";

const Sidebar = ({ collapsed, isNotifOpen }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/super-admin/dashboard",
    },
    {
      key: "waste-plants",
      icon: <EnvironmentOutlined />,
      label: "Waste Plants",
      path: "/super-admin/waste-plants",
    },
    {
      key: "subscription-plans",
      icon: <DollarOutlined />,
      label: "Subscription Plans",
      path: "/super-admin/subscription-plans",
    },
    {
      key: "payment-history",
      icon: <HistoryOutlined />,
      label: "Payment History",
      path: "/super-admin/payment-history",
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
      <div className="h-16 flex items-center justify-center border-b border-green-700">
        <h2
          className={`text-white font-semibold ${
            collapsed ? "text-lg" : "text-xl"
          }`}
        >
          {collapsed ? "WM" : "ReNeWaste"}
        </h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              {/* <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors w-full ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700 hover:bg-opacity-50'
                  }`
                }
              >
                <span className="flex-shrink-0 text-lg">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink> */}
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

export default Sidebar;
