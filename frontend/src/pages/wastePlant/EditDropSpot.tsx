import React, { useEffect } from "react";
import { Input, Button, Row, Col, Typography, Layout, Spin, Form } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchDropSpotById,
  updateDropSpot,
} from "../../redux/slices/wastePlant/wastePlantDropSpotSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { toast } from "react-toastify";
import { DropSpotFormValues } from "../../types/dropSpotTypes";

const { Title } = Typography;
const { Content } = Layout;

const EditDropSpot: React.FC = () => {
  const [form] = Form.useForm<DropSpotFormValues>();
  const { dropSpotId } = useParams<{ dropSpotId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dropSpot = useSelector(
    (state: RootState) => state.wastePlantDropSpot.selectedDropSpot
  );
  const loading = useSelector(
    (state: RootState) => state.wastePlantDropSpot.loading
  );

  useEffect(() => {
    if (dropSpotId) {
      dispatch(fetchDropSpotById(dropSpotId));
    }
  }, [dispatch, dropSpotId]);

  useEffect(() => {
    if (dropSpot) {
      form.setFieldsValue({
        dropSpotName: dropSpot.dropSpotName,
        addressLine: dropSpot.addressLine,
        location: dropSpot.location,
        pincode: dropSpot.pincode,
        district: dropSpot.district,
        state: dropSpot.state,
      });
    }
  }, [dropSpot, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(
        updateDropSpot({
          dropSpotId: dropSpotId!,
          data: values,
        })
      ).unwrap();
      toast.success("Drop spot updated successfully");
      navigate("/waste-plant/drop-spots");
    } catch (error) {
      toast.error("Failed to update drop spot");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!loading && !dropSpot) return <div>No drop spot data found.</div>;

  return (
    <Content>
      <div style={{ marginBottom: 16 }}>
        <Breadcrumbs
          paths={[
            { label: "Drop Spots", path: "/waste-plant/drop-spots" },
            { label: "Edit Drop Spot" },
          ]}
        />
      </div>

      <Title level={3}>Edit Dropspot</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Drop Spot Name"
          name="dropSpotName"
          rules={[{ required: true, message: "Drop Spot Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address Line"
          name="addressLine"
          rules={[{ required: true, message: "Address Line is required" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Location is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                { required: true, message: "Pincode is required" },
                {
                  pattern: /^[0-9]{6}$/,
                  message: "Pincode must be a 6-digit number",
                },
              ]}
            >
              <Input
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="District" name="district">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="State" name="state">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default EditDropSpot;
