import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEditProfile,
  updateUserProfile,
} from "../../services/user/profileService";
import { UserProfile } from "../../types/profileTypes";
import { useProfileValidation } from "../../hooks/useProfileValidation";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { validate, getErrorMessages } = useProfileValidation();
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addresses: [
      {
        addressLine1: "",
        addressLine2: "",
        location: "",
        pincode: "",
        district: "",
        state: "",
      },
    ],
  });

  const token: string = localStorage.getItem("token") ?? "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getEditProfile(token);
        setUser(userData);
      } catch (error: any) {
        toast.error("Error fetching profile:", error.response?.data || error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    let hasErrors = false;
    const newErrors: Record<string, string[]> = {};
    const necessaryFields: (keyof UserProfile)[] = ["firstName", "lastName", "email", "phone"];
    necessaryFields.forEach((key) => {
      const value = user[key];
  
      if (typeof value === "string" && value.trim() !== "") {  
        validate(key, value); 
      } else {
        newErrors[key] = ["This field is required."];
        hasErrors = true;
      }
  
      if (getErrorMessages(key).length > 0) {
        newErrors[key] = getErrorMessages(key);
        hasErrors = true;
      }
    });
  
    user.addresses.forEach((address, index) => {
      Object.entries(address).forEach(([key, value]) => {
        const fieldName = `addresses[${index}].${key}`;
        if (typeof value === "string" && value.trim() !== "") {
          validate(fieldName, value);
        } else {
          newErrors[fieldName] = ["This field is required."];
          hasErrors = true;
        }
  
        if (getErrorMessages(fieldName).length > 0) {
          newErrors[fieldName] = getErrorMessages(fieldName);
          hasErrors = true;
        }
      });
    });

    if (hasErrors) {
      toast.error("Please correct the highlighted errors before submitting.");
      return;
    }
  
    try {
      await updateUserProfile(token, user);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error("Error updating profile: " + (error.response?.data || error.message));
    }
  };
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      [
        "addressLine1",
        "addressLine2",
        "location",
        "pincode",
        "district",
        "state",
      ].includes(name)
    ) {
      setUser((prevUser) => ({
        ...prevUser,
        addresses: [{ ...prevUser.addresses[0], [name]: value }],
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  return (
    <div className="min-h-screen bg-green-100">
    <Header />
    <Breadcrumbs paths = {[{label: "Profile", path: "/profile"},{label: "Edit Profile"}]} />
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("firstName").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("lastName").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("phone").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col col-span-2">
            <label className="font-medium text-gray-700">Address Line 1:</label>
            <input
              type="text"
              name="addressLine1"
              value={user.addresses[0]?.addressLine1}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("addressLine1").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col col-span-2">
            <label className="font-medium text-gray-700">Address Line 2:</label>
            <input
              type="text"
              name="addressLine2"
              value={user.addresses[0]?.addressLine2}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("addressLine2").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              value={user.addresses[0]?.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("location").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={user.addresses[0]?.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("pincode").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">District:</label>
            <input
              type="text"
              name="district"
              value={user.addresses[0]?.district}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("district").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">State:</label>
            <input
              type="text"
              name="state"
              value={user.addresses[0]?.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {getErrorMessages("state").map((err, index) => (
              <p key={index} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default EditProfilePage;
