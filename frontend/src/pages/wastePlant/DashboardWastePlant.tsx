import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Truck, Users, Recycle, Activity } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchDashboardData } from "../../redux/slices/wastePlant/wastePlantDashboardSlice";
import SubscriptionModal from "../../components/wastePlant/SubscriptionModal";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardWastePlant = () => {
  const dispatch = useAppDispatch();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
const filters = ["daily", "weekly", "monthly", "yearly", "custom"] as const;

const [trendFilter, setTrendFilter] =
  useState<typeof filters[number]>("weekly");

const [customRange, setCustomRange] = useState({
  from: "",
  to: "",
});

  const { summary, pickupStatus, loading, pickupTrends } = useSelector(
    (state: RootState) => state.wastePlantDashboard
  );
// const pickupTrends= [
//   { date: "Mon", residential: 10, commercial: 5 },
//   { date: "Tue", residential: 18, commercial: 8 },
//   { date: "Wed", residential: 14, commercial: 5 },
//   { date: "Thu", residential: 16, commercial: 12 },
//   { date: "Fri", residential: 10, commercial: 5 },
// ]

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  useEffect(() => {
  if (trendFilter !== "custom") {
    dispatch(fetchDashboardData({ filter: trendFilter }));
  }
}, [trendFilter]);

  useEffect(() => {
    const status = localStorage.getItem("wasteplant_status");
    if (status === "Inactive" || status === "Pending") {
      setShowSubscriptionModal(true);
    } else {
      setShowSubscriptionModal(false);
    }
  }, []);

  const handleApplyCustom = () => {
  if (!customRange.from || !customRange.to) return;

  dispatch(
    fetchDashboardData({
      filter: "custom",
      from: customRange.from,
      to: customRange.to,
    })
  );
};

  const stats = [
    {
      title: "Active Drivers",
      value: summary?.totalDrivers?.active || 0,
      icon: <Users className="text-green-600 w-6 h-6" />,
    },
    {
      title: "Active Trucks",
      value: summary?.totalTrucks?.active || 0,
      icon: <Truck className="text-green-600 w-6 h-6" />,
    },
    {
      title: "Active Pickups",
      value: summary?.totalActivePickups || 0,
      icon: <Activity className="text-green-600 w-6 h-6" />,
    },
    {
      title: "Residential Waste",
      value: `${summary?.totalWasteCollected?.totalResidWaste || 0} Kg`,
      icon: <Recycle className="text-green-600 w-6 h-6" />,
    },
    {
      title: "Commercial Waste",
      value: `${summary?.totalWasteCollected?.totalCommWaste || 0} Kg`,
      icon: <Recycle className="text-green-600 w-6 h-6" />,
    },
    {
      title: "Total Revenue",
      value: `${summary?.totalRevenue || 0} Rs`,
      icon: <Recycle className="text-green-600 w-6 h-6" />,
    },
  ];
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Waste Plant Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4 border border-green-200"
          >
            <div className="bg-green-100 rounded-full p-3">{stat.icon}</div>
            <div>
              <p className="text-sm text-green-700">{stat.title}</p>
              <p className="text-xl font-semibold text-green-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
{/* Pickup Trends */}
{pickupTrends && (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-green-200 mb-8">
    
    {/* Header + Filters */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-4">
      
      <h2 className="text-lg font-semibold text-green-800">
        Pickup Trends
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* FILTER DROPDOWN */}
        <select
          value={trendFilter}
          onChange={(e) =>
            setTrendFilter(e.target.value as typeof trendFilter)
          }
          className="border rounded px-3 py-1 text-sm capitalize"
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* CUSTOM DATE RANGE */}
        {trendFilter === "custom" && (
          <>
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange({
                  ...customRange,
                  from: e.target.value,
                })
              }
              className="border rounded px-3 py-1 text-sm"
            />

            <input
              type="date"
              value={customRange.to}
              onChange={(e) =>
                setCustomRange({
                  ...customRange,
                  to: e.target.value,
                })
              }
              className="border rounded px-3 py-1 text-sm"
            />

            <button
              onClick={handleApplyCustom}
              disabled={!customRange.from || !customRange.to}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Apply
            </button>
          </>
        )}
      </div>
    </div>

    {/* Chart */}
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={pickupTrends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Line dataKey="residential" stroke="#16a34a" strokeWidth={3} />
        <Line dataKey="commercial" stroke="#2563eb" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}


      {/* Pickup Status Section */}
      {/* {pickupStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
                <h2 className="text-lg font-semibold text-green-800 mb-4">
                  Residential Pickups
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Pending"
                    value={pickupStatus.Residential.Pending}
                  />
                  <StatCard
                    title="Scheduled"
                    value={pickupStatus.Residential.Scheduled}
                  />
                  <StatCard
                    title="Rescheduled"
                    value={pickupStatus.Residential.Rescheduled}
                  />
                  <StatCard
                    title="Completed"
                    value={pickupStatus.Residential.Completed}
                  />
                  <StatCard
                    title="Cancelled"
                    value={pickupStatus.Residential.Cancelled}
                  />
                  <StatCard
                    title="Active"
                    value={pickupStatus.Residential.Active}
                    color="bg-green-100"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
                <h2 className="text-lg font-semibold text-green-800 mb-4">
                  Commercial Pickups
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Pending"
                    value={pickupStatus.Commercial.Pending}
                  />
                  <StatCard
                    title="Scheduled"
                    value={pickupStatus.Commercial.Scheduled}
                  />
                  <StatCard
                    title="Rescheduled"
                    value={pickupStatus.Commercial.Rescheduled}
                  />
                  <StatCard
                    title="Completed"
                    value={pickupStatus.Commercial.Completed}
                  />
                  <StatCard
                    title="Cancelled"
                    value={pickupStatus.Commercial.Cancelled}
                  />
                  <StatCard
                    title="Active"
                    value={pickupStatus.Commercial.Active}
                    color="bg-green-100"
                  />
                </div>
              </div>
            </div>
          )} */}
      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color = "bg-white",
}: {
  title: string;
  value: number;
  color?: string;
}) => (
  <div className={`${color} p-3 rounded-lg border border-green-100`}>
    <p className="text-sm text-green-700">{title}</p>
    <p className="text-lg font-semibold text-green-900">{value}</p>
  </div>
);

export default DashboardWastePlant;
