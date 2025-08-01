import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  fetchPlantProfile,
  updatePlantProfile,
} from "../../redux/slices/wastePlant/wastePlantProfileSlice";
import {
  Button,
  Form,
  Input,
  Card,
  Col,
  Row,
} from "antd";
import { WastePlant } from "../../types/wasteplant/wastePlantTypes";
import { useAppDispatch } from "../../redux/hooks";
import LicenseDocumentViewer from "../../components/wastePlant/LicenseDocumentViewer";
import {
  alphanumericRule,
  capacityValidationRule,
  noTrailingSpaceAlphaRule,
  requiredNumberOnlyRule,
} from "../../utils/antDValidationRules";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const EditProfileWasteplant = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wasteplant, loading } = useSelector(
    (state: RootState) => state.wastePlantProfile
  );
  console.log("wasteplant",wasteplant);
  
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!wasteplant) {
      dispatch(fetchPlantProfile());
    } else {
      form.setFieldsValue(wasteplant);
    }
  }, [dispatch, wasteplant, form]);

  const onFinish = (values: WastePlant) => {
    console.log("values", values);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (file) {
      console.log("file", file);

      formData.append("licenseDocument", file);
    }
    dispatch(updatePlantProfile(formData)).then(() => {
      navigate("/waste-plant/profile");
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div style={{ marginBottom: 16 }}>
        <Breadcrumbs
          fullWidth
          paths={[
            { label: "Profile", path: "/waste-plant/profile" },
            { label: "Edit Profile" },
          ]}
        />
      </div>

      <Card variant="outlined" title="Edit Waste Plant Profile">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Plant Name"
                name="plantName"
                rules={noTrailingSpaceAlphaRule}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Owner Name"
                name="ownerName"
                rules={noTrailingSpaceAlphaRule}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Pincode"
                name="pincode"
                rules={requiredNumberOnlyRule(6)}
              >
                <Input maxLength={6} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={noTrailingSpaceAlphaRule}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="District" name="district">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Taluk" name="taluk">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="State" name="state">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Info"
                name="contactInfo"
                rules={noTrailingSpaceAlphaRule}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact No"
                name="contactNo"
                rules={requiredNumberOnlyRule(10)}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="License Number"
                name="licenseNumber"
                rules={alphanumericRule}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Capacity"
                name="capacity"
                rules={capacityValidationRule()}
              >
                 <Input placeholder="Enter capacity" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="License Document">
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                {wasteplant?.cloudinaryPublicId  && (
                  <LicenseDocumentViewer
                    // licenseDocumentPath={wasteplant.licenseDocumentPath}
                    apiBaseUrl={import.meta.env.VITE_WASTE_PLANT_API_URL}
                    cloudinaryPublicId={wasteplant.cloudinaryPublicId}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-center mt-4">
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfileWasteplant;
