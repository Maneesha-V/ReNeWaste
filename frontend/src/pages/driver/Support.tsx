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

  if (error) return <p className="text-center mt-10 text-red-500 px-4">{error}</p>;
  if (!supportInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <p className="text-center text-gray-600">Support information not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-green-200 p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          Waste Plant Support
        </h2>

        <p className="text-sm sm:text-base text-gray-700">
          If you need help, please reach out to your waste plant support team.
        </p>

        <div className="mt-6 space-y-5">
          <div className="flex items-start gap-3">
            <Phone className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
            <span className="text-gray-800 break-all">
              {supportInfo?.contactNo}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
            <span className="text-gray-800 break-all">
              {supportInfo?.email}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
            <span className="text-gray-800 break-words">
              {`${supportInfo.location}, ${supportInfo.taluk}, ${supportInfo.district}, ${supportInfo.state}, ${supportInfo.pincode}`}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t pt-4">
          <p className="text-sm sm:text-base text-gray-700">
            Waste Plant:
            <span className="font-semibold text-green-700 ml-1">
              {supportInfo.plantName}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
