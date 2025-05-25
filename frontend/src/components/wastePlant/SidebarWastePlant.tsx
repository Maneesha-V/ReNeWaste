import { NavLink } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  InboxOutlined ,
  ShoppingOutlined,
  AimOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { SidebarWastePlantProps } from '../../types/wastePlantTypes';


const SidebarWastePlant = ({ collapsed }: SidebarWastePlantProps) => {
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/waste-plant/dashboard' },
    { key: 'pickups', icon: <InboxOutlined  />, label: 'Pickups', path: '/waste-plant/pickups' },
    { key: 'drivers', icon: <TeamOutlined />, label: 'Drivers', path: '/waste-plant/drivers' },
    { key: 'trucks', icon: <CarOutlined />, label: 'Trucks', path: '/waste-plant/trucks' },
    { key: 'users', icon: <UserOutlined />, label: 'Users', path: '/waste-plant/users' },  
    { key: 'drop-spots', icon: <AimOutlined />, label: 'Drop Spots', path: '/waste-plant/drop-spots' },
    { key: 'waste-reports', icon: <FileTextOutlined />, label: 'Waste Reports', path: '/waste-plant/waste-reports' },
    { key: 'pay-earn', icon: <DollarOutlined />, label: 'Pay & Earn', path: '/waste-plant/pay-earn' },
    { key: 'subscription', icon: <ShoppingOutlined />, label: 'Subscription', path: '/waste-plant/subscription' },
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-center border-b border-green-700">
        <h2 className={`text-white font-semibold ${collapsed ? 'text-lg' : 'text-xl'}`}>
          {collapsed ? 'WP' : 'Waste Plant'}
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

export default SidebarWastePlant;
