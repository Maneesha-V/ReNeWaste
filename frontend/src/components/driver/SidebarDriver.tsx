import { NavLink, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  FileTextOutlined,
  DollarOutlined,
  InboxOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import { FaUserCircle } from 'react-icons/fa';

type SidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
};

const SidebarDriver = ({ collapsed }: SidebarProps) => {
  const navigate  = useNavigate();
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/driver/dashboard' },
    { key: 'pickups', icon: <InboxOutlined />, label: 'Pickups', path: '/driver/alloted-pickups' },
    { key: 'assigned-trucks', icon: <CarOutlined />, label: 'Assigned Trucks', path: '/driver/assigned-trucks' },
    { key: 'pay-bills', icon: <DollarOutlined />, label: 'Pay & Bills', path: '/driver/pay-bills' },
    { key: 'reports', icon: <FileTextOutlined />, label: 'Reports', path: '/driver/reports' },
    { key: 'stats', icon: <BarChartOutlined />, label: 'Stats', path: '/driver/stats' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path); 
  };

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-start border-b border-green-700 px-3">
      <button onClick={() => handleNavigation('/driver/profile')}>
          <FaUserCircle className="w-8 h-8 cursor-pointer hover:text-green-600" />
        </button>

        {!collapsed && (
          <h2 className="text-white font-semibold text-xl ml-3">Driver</h2>
        )}

        {collapsed && (
          <h2 className="text-white font-semibold text-lg ml-2">DR</h2>
        )}
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <NavLink
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
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarDriver;
