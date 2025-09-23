import {
  Truck,
  ClipboardCheck,
  Clock,
  CheckCircle,
  PhoneCall,
  ClipboardList,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchDriverDashboard } from "../../redux/slices/driver/dashboardDriverSlice";
import { Link } from "react-router-dom";

const DashboardDriver = () => {
  const dispatch = useAppDispatch();
  const { summary } = useSelector(
    (state: RootState) => state.driverDashboard
  );
  console.log("summary", summary);

  useEffect(() => {
    dispatch(fetchDriverDashboard());
  }, [dispatch]);


  const quickActions = [
    {
      label: "View All Tasks",
      icon: ClipboardList,
      to: "/driver/alloted-pickups",
    },
    { label: "Contact Support", icon: PhoneCall, to: "/driver/support" },
  ];

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Welcome, {summary?.driver.name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Truck */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex space-x-4 border border-green-200">
          <div className="bg-green-100 rounded-full p-3">
            <Truck className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-green-700">Assigned Truck</p>
            <p className="text-lg font-semibold text-green-900">
              {summary?.truck?.vehicleNumber}
            </p>
            <p className="text-sm text-gray-600">{summary?.truck?.name}</p>
            {summary?.truck?.status === "Active" && (
              <p className="text-sm text-green-600">✅ Active</p>
            )}
            {summary?.truck?.status === "Inactive" && (
              <p className="text-sm text-red-600">❌ Inactive</p>
            )}
            {summary?.truck?.status === "Maintenance" && (
              <p className="text-sm text-yellow-600">🛠️ Maintenance</p>
            )}
          </div>
        </div>

        {/* Task Summary - Completed */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex space-x-4 border border-green-200">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-green-700">Completed Tasks</p>
            <p className="text-2xl font-bold text-green-900">
              {summary?.pickupStats?.completedTasks}
            </p>
          </div>
        </div>

        {/* Task Summary - Pending */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex space-x-4 border border-green-200">
          <div className="bg-yellow-100 rounded-full p-3">
            <Clock className="text-yellow-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-yellow-700">Pending Tasks</p>
            <p className="text-2xl font-bold text-yellow-900">
              {summary?.pickupStats?.assignedTasks}
            </p>
          </div>
        </div>

        {/* Task Summary - Total */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex space-x-4 border border-green-200">
          <div className="bg-blue-100 rounded-full p-3">
            <ClipboardCheck className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700">Total Assigned</p>
            <p className="text-2xl font-bold text-blue-900">
              {(summary?.pickupStats?.assignedTasks ?? 0) +
                (summary?.pickupStats?.completedTasks ?? 0)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col space-y-3 border border-green-200">
          <p className="text-sm text-green-700 font-semibold">Quick Actions</p>
          {quickActions.map((action, i) => (
            <Link
              to={action.to}
              key={i}
              className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200 text-sm font-medium"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardDriver;
