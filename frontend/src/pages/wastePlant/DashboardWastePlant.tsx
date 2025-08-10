import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Truck, Users, Recycle, Activity } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchDashboardData } from "../../redux/slices/wastePlant/wastePlantDashboardSlice";
import SubscriptionModal from "../../components/wastePlant/SubscriptionModal";

const DashboardWastePlant = () => {
  const dispatch = useAppDispatch();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const { summary, pickupStatus, loading } = useSelector(
    (state: RootState) => state.wastePlantDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);
  useEffect(() => {
    const status = localStorage.getItem("wasteplant_status");
    if (status === "Inactive") {
      setShowSubscriptionModal(true);
    }
  }, []);

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

// return (
//   <div className="p-6 bg-green-50 min-h-screen">
//     <h1 className="text-2xl font-bold text-green-800 mb-6">Waste Plant Dashboard</h1>

//     {loading ? (
//       <p className="text-green-700">Loading dashboard data...</p>
//     ) : (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4 border border-green-200"
//           >
//             <div className="bg-green-100 rounded-full p-3">{stat.icon}</div>
//             <div>
//               <p className="text-sm text-green-700">{stat.title}</p>
//               <p className="text-xl font-semibold text-green-900">{stat.value.}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// };

export default DashboardWastePlant;
