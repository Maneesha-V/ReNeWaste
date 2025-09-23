import { MenuItemProps } from "../../types/common/modalTypes";

const MenuItem = ({ item, collapsed, active, onClick }: MenuItemProps) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-lg transition-colors ${
          active 
            ? 'bg-green-700 text-white' 
            : 'text-green-100 hover:bg-green-700 hover:bg-opacity-50'
        }`}
      >
        <span className="flex-shrink-0 text-lg">{item.icon}</span>
        {!collapsed && <span className="ml-3">{item.label}</span>}
      </button>
    </li>
  );
};

export default MenuItem;