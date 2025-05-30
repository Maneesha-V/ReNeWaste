// const DashboardWastePlant = () => {
//   return <div>DashboardContent</div>;
// };

// export default DashboardWastePlant;
// DashboardWastePlant.tsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Truck, Users, Recycle, DollarSign, Activity } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchDashboardData } from "../../redux/slices/wastePlant/wastePlantDashboardSlice";

const DashboardWastePlant = () => {
  const dispatch = useAppDispatch()

  const { drivers, trucks, pickups, revenue, waste, loading } = useSelector(
    (state: RootState) => state.wastePlantDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const stats = [
    { title: "Total Drivers", value: drivers, icon: <Users className="text-green-600 w-6 h-6" /> },
    { title: "Total Trucks", value: trucks, icon: <Truck className="text-green-600 w-6 h-6" /> },
    { title: "Active Pickups", value: pickups, icon: <Activity className="text-green-600 w-6 h-6" /> },
    { title: "Total Revenue", value: `₹${revenue}`, icon: <DollarSign className="text-green-600 w-6 h-6" /> },
    { title: "Waste Collected", value: `${waste} Tons`, icon: <Recycle className="text-green-600 w-6 h-6" /> },
  ];

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Waste Plant Dashboard</h1>

      {loading ? (
        <p className="text-green-700">Loading dashboard data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4 border border-green-200"
            >
              <div className="bg-green-100 rounded-full p-3">{stat.icon}</div>
              <div>
                <p className="text-sm text-green-700">{stat.title}</p>
                <p className="text-xl font-semibold text-green-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWastePlant;

