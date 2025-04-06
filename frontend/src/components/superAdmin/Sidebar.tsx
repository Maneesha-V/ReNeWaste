import { NavLink } from 'react-router-dom';
import { 
  DashboardOutlined, 
  EnvironmentOutlined, 
  DollarOutlined, 
  HistoryOutlined 
} from '@ant-design/icons';
import { ReactNode } from 'react';

type SidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/super-admin/dashboard' },
    { key: 'waste-plants', icon: <EnvironmentOutlined />, label: 'Waste Plants', path: '/super-admin/waste-plants' },
    { key: 'subscription-fee', icon: <DollarOutlined />, label: 'Subscription Fee', path: '/super-admin/subscription-fee' },
    { key: 'payment-history', icon: <HistoryOutlined />, label: 'Payment History', path: '/super-admin/payment-history' },
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-center border-b border-green-700">
        <h2 className={`text-white font-semibold ${collapsed ? 'text-lg' : 'text-xl'}`}>
          {collapsed ? 'WM' : 'ReNeWaste'}
        </h2>
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

export default Sidebar;