import { Factory, Users, DollarSign, Truck, LineChart as LineChartIcon, } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { JSX, useEffect } from "react";
import { fetchSuperAdminDashboard } from "../../redux/slices/superAdmin/superAdminDashboardSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
const SuperadminDashboard = () => {
  const dispatch = useAppDispatch();

  const { summary } = useSelector(
    (state: RootState) => state.superAdminDashboard
  );
  useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);
  if (!summary) {
    return <div className="p-6 text-green-700">Loading dashboard...</div>;
  }
 const {
    totalPlants,
    totalDrivers,
    totalTrucks,
    totalWasteCollected,
    monthlyRevenue,
  } = summary;

  const latestRevenue =
    monthlyRevenue?.[monthlyRevenue.length - 1]?.totalRevenue || 0;
 return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Welcome, {summary.adminData?.name || "Superadmin"}
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Waste Collected */}
        <StatCard
          title="Waste Collected"
          value={`${totalWasteCollected.toLocaleString()} kg`}
          icon={<LineChartIcon className="text-green-600 w-6 h-6" />}
          bg="bg-green-100"
          text="text-green-700"
        />

        {/* Total Plants */}
        <StatCard
          title="Total Plants"
          value={totalPlants}
          icon={<Factory className="text-blue-600 w-6 h-6" />}
          bg="bg-blue-100"
          text="text-blue-700"
        />

        {/* Active Drivers */}
        <StatCard
          title="Total Drivers"
          value={totalDrivers}
          icon={<Users className="text-yellow-600 w-6 h-6" />}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />

        {/* Monthly Revenue */}
        <StatCard
          title="Monthly Revenue"
          value={`₹${latestRevenue.toLocaleString()}`}
          icon={<DollarSign className="text-green-600 w-6 h-6" />}
          bg="bg-green-100"
          text="text-green-700"
        />

        {/* Total Trucks */}
        <StatCard
          title="Total Trucks"
          value={totalTrucks}
          icon={<Truck className="text-indigo-600 w-6 h-6" />}
          bg="bg-indigo-100"
          text="text-indigo-700"
        />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Monthly Revenue (Line Chart)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#16a34a"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
       {/* Bar Chart */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-green-200">
    <h2 className="text-xl font-semibold text-green-800 mb-4">
      Monthly Revenue (Bar Chart)
    </h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyRevenue}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalRevenue" fill="#4ade80" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  bg,
  text,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  bg: string;
  text: string;
}) => (
  <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
    <div className={`${bg} p-3 rounded-full`}>{icon}</div>
    <div>
      <p className={`text-sm ${text}`}>{title}</p>
      <p className="text-2xl font-bold text-green-900">{value}</p>
    </div>
  </div>
);

  // return (
  //   <div className="p-6 bg-green-50 min-h-screen">
  //     <h1 className="text-2xl font-bold text-green-800 mb-6">
  //       Welcome, {summary.adminData?.name || "Superadmin"}
  //     </h1>

  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {/* Total Waste Collected */}
  //       <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
  //         <div className="bg-green-100 p-3 rounded-full">
  //           <LineChart className="text-green-600 w-6 h-6" />
  //         </div>
  //         <div>
  //           <p className="text-sm text-green-700">Waste Collected</p>
  //           <p className="text-2xl font-bold text-green-900">
  //             {`${totalWasteCollected.toLocaleString()} kg`}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Total Plants */}
  //       <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
  //         <div className="bg-blue-100 p-3 rounded-full">
  //           <Factory className="text-blue-600 w-6 h-6" />
  //         </div>
  //         <div>
  //           <p className="text-sm text-blue-700">Total Plants</p>
  //           <p className="text-2xl font-bold text-blue-900">
  //             {totalPlants}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Active Drivers */}
  //       <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
  //         <div className="bg-yellow-100 p-3 rounded-full">
  //           <Users className="text-yellow-600 w-6 h-6" />
  //         </div>
  //         <div>
  //           <p className="text-sm text-yellow-700">Active Drivers</p>
  //           <p className="text-2xl font-bold text-yellow-900">
  //             {totalDrivers}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Monthly Revenue */}
  //       <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
  //         <div className="bg-green-100 p-3 rounded-full">
  //           <DollarSign className="text-green-600 w-6 h-6" />
  //         </div>
  //         <div>
  //           <p className="text-sm text-green-700">Monthly Revenue</p>
  //           <p className="text-2xl font-bold text-green-900">
  //             {`$${latestRevenue.toLocaleString()}`}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Total Trucks */}
  //       <div className="bg-white shadow-md rounded-2xl p-5 border border-green-200 flex space-x-4">
  //         <div className="bg-indigo-100 p-3 rounded-full">
  //           <Truck className="text-indigo-600 w-6 h-6" />
  //         </div>
  //         <div>
  //           <p className="text-sm text-indigo-700">Total Trucks</p>
  //           <p className="text-2xl font-bold text-indigo-900">
  //             {totalTrucks}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );


export default SuperadminDashboard;
