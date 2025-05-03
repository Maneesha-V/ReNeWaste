import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserProfile } from "../../types/profileTypes";
import { useProfileValidation } from "../../hooks/useProfileValidation";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import {
  getUserEditProfile,
  updateProfile,
} from "../../redux/slices/user/userProfileSlice";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Spin } from "antd";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.user);
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
        taluk: "",
        location: "",
        pincode: "",
        district: "",
        state: "",
      },
    ],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await dispatch(getUserEditProfile()).unwrap();
        setUser(userData);
      } catch (error: any) {
        toast.error("Error fetching profile:", error.response?.data || error);
      }
    };

    fetchUserProfile();
  }, [dispatch]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors: Record<string, string[]> = {};
    const necessaryFields: (keyof UserProfile)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
    ];
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
        if (key !== "latitude" && key !== "longitude") {
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
        }
      });
    });

    if (hasErrors) {
      console.log("newErrors", newErrors);
      toast.error("Please correct the highlighted errors before submitting.");
      return;
    }
    const updatedUser = {
      ...user,
      addresses: [
        {
          ...user.addresses[0],
          state: "Kerala",
          district: "Malappuram",
        },
      ],
    };
    try {
      console.log("updatedUser", updatedUser);

      await dispatch(updateProfile(updatedUser)).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(
        "Error updating profile: " + (error.response?.data || error.message)
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "addressLine1",
        "addressLine2",
        "taluk",
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

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <Breadcrumbs
        paths={[
          { label: "Profile", path: "/profile" },
          { label: "Edit Profile" },
        ]}
      />
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-3xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <div>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
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
                <label className="font-medium text-gray-700">
                  Address Line 1:
                </label>
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

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">
                  Address Line 2:
                </label>
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
              {/* Taluk */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Taluk</label>
                <select
                  name="taluk"
                  value={user.addresses[0]?.taluk}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Taluk</option>
                  <option value="Tirur">Tirur</option>
                  <option value="Perinthalmanna">Perinthalmanna</option>
                  <option value="Ponnani">Ponnani</option>
                  <option value="Kondotty">Kondotty</option>
                  <option value="Tirurangadi">Tirurangadi</option>
                  <option value="Nilambur">Nilambur</option>
                  <option value="Eranad">Eranad</option>
                </select>
                {getErrorMessages("taluk").map((err, index) => (
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
                  value="Malappuram"
                  readOnly
                  className="mt-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium text-gray-700">State:</label>
                <input
                  type="text"
                  name="state"
                  value="Kerala"
                  readOnly
                  className="mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col mt-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
              <div className="flex flex-col mt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfilePage;
