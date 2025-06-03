import { NotificationBadgeProps } from "../../types/commonTypes";
  
  const NotificationBadge = ({ count }: NotificationBadgeProps) => {
    return (
      <div className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative cursor-pointer">
        <span className="text-lg">🔔</span>
        {count > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
    );
  };
  
  export default NotificationBadge;