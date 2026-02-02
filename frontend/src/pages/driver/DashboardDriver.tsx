import {
  Truck,
  ClipboardCheck,
  Clock,
  CheckCircle,
  MapPin,
  Wallet,
  Leaf,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import {
  fetchDriverDashboard,
  fetchEarnDriverStats,
  markAttendance,
} from "../../redux/slices/driver/dashboardDriverSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  EarningsData,
} from "../../types/attendance/attendanceTypes";
import { formatTimeTo12Hour } from "../../utils/formatDate";

const DashboardDriver = () => {
  const dispatch = useAppDispatch();
  const [earnFilter, setEarnFilter] = useState<
    "daily" | "monthly" | "yearly" | "custom"
  >("daily");
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [customRange, setCustomRange] = useState({
    from: "",
    to: "",
  });

  const { summary } = useSelector((state: RootState) => state.driverDashboard);
  console.log("summary", summary);

  useEffect(() => {
    dispatch(fetchDriverDashboard());
  }, [dispatch]);

  const filters = ["daily", "monthly", "yearly", "custom"] as const;

  useEffect(() => {
    const loadStats = async () => {
      const res = await dispatch(
        fetchEarnDriverStats({
          filter: earnFilter,
          from: "",
          to: "",
        }),
      ).unwrap();
      const transformed = res.earnRewardStats.map((item) => ({
        name: Object.values(item._id)[0],
        reward: item.totalReward,
        earning: item.totalEarning,
      }));
      setEarningsData(transformed);
    };
    loadStats();
  }, [earnFilter]);

  useEffect(() => {
    if (earnFilter !== "custom") {
      setCustomRange({ from: "", to: "" });
    }
  }, [earnFilter]);

  const handleMarkAttendance = async (status: string) => {
    try {
      const result = await dispatch(markAttendance(status)).unwrap();

      toast.success(result?.message);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };
  const handleApplyCustom = async () => {
    if (!customRange.from || !customRange.to) return;

    const res = await dispatch(
      fetchEarnDriverStats({
        filter: "custom",
        from: customRange.from,
        to: customRange.to,
      }),
    ).unwrap();

    const transformed = res.earnRewardStats.map((item) => ({
      name: Object.values(item._id)[0],
      reward: item.totalReward,
      earning: item.totalEarning,
    }));

    setEarningsData(transformed);
  };

  const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"];

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Attendance Button */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={() => handleMarkAttendance("present")}
          className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 flex items-center space-x-2"
        >
          <ClipboardCheck className="w-5 h-5" />
          <span>Mark Present</span>
        </button>

        <button
          onClick={() => handleMarkAttendance("absent")}
          className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 flex items-center space-x-2"
        >
          <ClipboardCheck className="w-5 h-5" />
          <span>Mark Absent</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Welcome, {summary?.driver?.name}
      </h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assigned Truck */}
            <div className="bg-white shadow rounded-xl p-5 flex space-x-4 border">
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="text-green-600" />
              </div>
              <div>
                <p className="text-sm">Assigned Truck</p>
                <p className="font-semibold">{summary?.truck?.vehicleNumber}</p>
                <p className="text-xs text-gray-500">{summary?.truck?.name}</p>
                <p className="text-green-600 text-xs">Active</p>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white shadow rounded-xl p-5 flex space-x-4 border">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-sm">Completed Tasks</p>
                <p className="text-xl font-bold">
                  {summary?.pickupStats?.completedTasks}
                </p>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white shadow rounded-xl p-5 flex space-x-4 border">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm">Pending Tasks</p>
                <p className="text-xl font-bold">
                  {summary?.pickupStats?.assignedTasks}
                </p>
              </div>
            </div>
          </div>

          {/* Earnings Chart with Filter */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between w-full">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-700" />
                <span>Earnings Overview</span>
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-end">
                {/* FILTER DROPDOWN */}
                <select
                  value={earnFilter}
                  onChange={(e) =>
                    setEarnFilter(e.target.value as typeof earnFilter)
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
                {earnFilter === "custom" && (
                  <>
                    <input
                      type="date"
                      value={customRange.from}
                      onChange={(e) =>
                        setCustomRange({ ...customRange, from: e.target.value })
                      }
                      className="border rounded px-3 py-1 text-sm"
                    />

                    <input
                      type="date"
                      value={customRange.to}
                      onChange={(e) =>
                        setCustomRange({ ...customRange, to: e.target.value })
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

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="earning" name="Earnings" fill="#4CAF50" />
                <Bar dataKey="reward" name="Rewards" fill="#FFC107" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}

          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

            {summary?.recentActivities?.length ? (
              <ul className="space-y-3">
                {summary.recentActivities.map((act, i) => (
                  <li key={i} className="flex flex-wrap gap-1 text-sm">
                    <span>Pickup -</span>
                    <span>{act.pickupId}</span>
                    <span>Completed at</span>
                    <span className="font-semibold text-green-700">
                      {formatTimeTo12Hour(act.completedAt)}
                    </span>
                    <span>in</span>
                    <span>{act.selectedAddress.addressLine1},</span>
                    <span>{act.selectedAddress.location}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-400 text-center py-6">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        {/* Driver Attendance Pie Chart */}

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Leaf className="text-green-600 w-5 h-5" />
              <span>Driver Attendance Breakdown</span>
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={summary?.attendanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="workType"
                  label
                >
                  {summary?.attendanceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Assigned Route */}

          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <MapPin className="text-blue-600 w-5 h-5" />
              <span>Assigned Route</span>
            </h2>
            <p className="text-sm text-gray-600">
              <b>Zone:</b> {summary?.driver?.assignedZone}
            </p>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="flex flex-col space-y-3">
              <button className="flex items-center space-x-2 p-2 bg-green-100 rounded">
                <ClipboardList className="w-4 h-4 text-green-700" />
                <span>View All Tasks</span>
              </button>

              <button className="flex items-center space-x-2 p-2 bg-green-100 rounded">
                <PhoneCall className="w-4 h-4 text-green-700" />
                <span>Contact Support</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardDriver;
