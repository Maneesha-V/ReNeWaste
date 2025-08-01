import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPlantProfile } from "../../redux/slices/wastePlant/wastePlantProfileSlice";
import { Card, Descriptions, Button, Spin, Result } from "antd";
import LicenseDocumentViewer from "../../components/wastePlant/LicenseDocumentViewer";

const ProfileWasteplant = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { wasteplant, loading, error } = useSelector(
    (state: RootState) => state.wastePlantProfile
  );

  useEffect(() => {
    dispatch(fetchPlantProfile());
  }, [dispatch]);

  const handleEdit = () => {
    navigate("/waste-plant/edit-profile");
  };

  return (
    <main className="flex-grow p-4 sm:p-6 md:p-8 bg-green-50 min-h-screen">
      {/* <Breadcrumbs paths={[{ label: "Profile" }]} /> */}

      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-700 text-center sm:text-left">
            Wasteplant Profile
          </h1>
          <Button type="primary" icon={<FaEdit />} onClick={handleEdit}>
            Edit
          </Button>
        </div>

        {loading ? (
          <Spin size="large" className="flex justify-center my-20" />
        ) : error ? (
          <Result status="error" title="Error" subTitle={error} />
        ) : wasteplant ? (
          <Card variant="outlined" title="Profile Details">
            <Descriptions
              bordered
              column={1}
              styles={{ label: { fontWeight: 600, width: "150px" } }}
            >
              <Descriptions.Item label="Plant Name">
                {wasteplant.plantName}
              </Descriptions.Item>
              <Descriptions.Item label="Owner Name">
                {wasteplant.ownerName}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {wasteplant.location}
              </Descriptions.Item>
              <Descriptions.Item label="District">
                {wasteplant.district}
              </Descriptions.Item>
              <Descriptions.Item label="Taluk">
                {wasteplant.taluk}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {wasteplant.pincode}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {wasteplant.state}
              </Descriptions.Item>
              <Descriptions.Item label="Contact No">
                {wasteplant.contactNo}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {wasteplant.email}
              </Descriptions.Item>
              <Descriptions.Item label="License No">
                {wasteplant.licenseNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Capacity">
                {wasteplant.capacity}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {wasteplant.status}
              </Descriptions.Item>
              <Descriptions.Item label="Subscription Plan">
                {wasteplant.subscriptionPlan}
              </Descriptions.Item>
              <Descriptions.Item label="Services">
                {wasteplant.services.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="License Document">
                {wasteplant.cloudinaryPublicId && (
                  <LicenseDocumentViewer
                    apiBaseUrl={import.meta.env.VITE_SUPER_ADMIN_API_URL}
                    cloudinaryPublicId={wasteplant.cloudinaryPublicId}
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <Result status="404" title="No Profile Data Found" />
        )}
      </div>
    </main>
  );
};

export default ProfileWasteplant;
