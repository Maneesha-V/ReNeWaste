import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Phone, Mail, MapPin } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchWastePlantSupport } from "../../redux/slices/driver/dashboardDriverSlice";

const Support = () => {
  const dispatch = useAppDispatch();
  const { supportInfo, error } = useSelector(
    (state: RootState) => state.driverDashboard
  );

  useEffect(() => {
    dispatch(fetchWastePlantSupport());
  }, [dispatch]);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!supportInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
        <p className="text-gray-600">Support information not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 border border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Waste Plant Support
        </h2>

        <p className="text-gray-700 mb-2">
          If you need help, please reach out to your waste plant support team.
        </p>

        <div className="space-y-4 mt-6">
          <div className="flex items-center space-x-3">
            <Phone className="text-green-600 w-5 h-5" />
            <span className="text-gray-800 font-medium">
              {supportInfo?.contactNo}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="text-green-600 w-5 h-5" />
            <span className="text-gray-800 font-medium">
              {supportInfo?.email}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="text-green-600 w-5 h-5" />
            <span className="text-gray-800 font-medium">
              {`${supportInfo.location}, ${supportInfo.taluk}, ${supportInfo.district}, ${supportInfo.state}, ${supportInfo.pincode}`}
            </span>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Waste Plant: <strong>{supportInfo?.plantName}</strong>
        </div>
      </div>
    </div>
  );
};

export default Support;
