import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { useAppDispatch } from "../../redux/hooks";
import { fetchUserProfile } from "../../redux/slices/user/userProfileSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [user, setUser] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.userProfile)
  // const token = localStorage.getItem("token");
  useEffect(() => {
      dispatch(fetchUserProfile());
    }, [dispatch]);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (!token) return;
  //     try {
  //       const res = await dispatch(fetchUserProfile()).unwrap();
  //       setUser(userData);
  //     } catch (error: any) {
  //       toast.error("Error fetching profile:", error);
  //     }
  //   };
  //   fetchProfile();
  // }, [token]);
  console.log("user", user);

  const handleEdit = () => {
    navigate("/edit-profile");
  };
  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      {/* Breadcrumb Section */}
      <Breadcrumbs
        paths={[{ label: "Home", path: "/home" }, { label: "Profile" }]}
      />

      {/* Profile Section */}
      <div className="flex justify-center pt-2 pb-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FaEdit className="w-5 h-5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">
                First Name:
              </span>
              <span className="text-gray-900">{user?.firstName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Last Name:</span>
              <span className="text-gray-900">{user?.lastName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{user?.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Address:</span>
              <span className="text-gray-900">
                {user?.addresses?.[0]
                  ? `${user.addresses[0].addressLine1}, ${user.addresses[0].addressLine2}, ${user.addresses[0].location}, ${user.addresses[0].district}, ${user.addresses[0].state}, ${user.addresses[0].pincode}`
                  : "No address available"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
