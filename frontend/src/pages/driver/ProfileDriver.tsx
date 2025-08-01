import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { fetchDriverProfile } from "../../redux/slices/driver/profileDriverSlice";
import { useEffect } from "react";

const ProfileDriver = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { driver, loading, error } = useSelector(
    (state: RootState) => state.driverProfile
  );
  console.log("driver",driver);
  
  useEffect(() => {
    dispatch(fetchDriverProfile() as any);
  }, [dispatch]);
  const handleEdit = () => {
    navigate("/driver/edit-profile");
  };

  return (
    <main className="flex-grow p-4 sm:p-6 md:p-8 bg-green-50 min-h-screen">
      <Breadcrumbs paths={[{ label: "Profile" }]} />
  
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-700 text-center sm:text-left">
            Driver Profile
          </h1>
          <button
            onClick={handleEdit}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            <FaEdit className="w-5 h-5" />
            <span>Edit</span>
          </button>
        </div>
  
        {loading ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : driver ? (
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-2">
              <p className="font-medium w-32">Name:</p>
              <p className="text-gray-600 break-all">{driver.name}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium w-32">Email:</p>
              <p className="text-gray-600 break-all">{driver.email}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium w-32">License No:</p>
              <p className="text-gray-600">{driver.licenseNumber}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium w-32">Experience:</p>
              <p className="text-gray-600">{driver.experience}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-medium w-32">Phone:</p>
              <p className="text-gray-600">{driver.contact}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No profile data found.</p>
        )}
      </div>
    </main>
  );
  
  
};

export default ProfileDriver;
