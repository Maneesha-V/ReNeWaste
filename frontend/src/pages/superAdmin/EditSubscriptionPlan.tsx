import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  fetchSubscriptionPlanById,
  updateSubscriptionPlan,
} from "../../redux/slices/superAdmin/superAdminSubscriptionPlanSlice";
import { Input, Button, Card, Col, Form, InputNumber, Row, Select } from "antd";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { SubsptnPlans } from "../../types/subscription/subscriptionTypes";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
const { TextArea } = Input;

const billingCycleOptions = ["Monthly", "Yearly"];

const EditSubscriptionPlan = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscriptionPlan, loading } = useSelector(
    (state: RootState) => state.superAdminSubscriptionPlan
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) dispatch(fetchSubscriptionPlanById(id));
  }, [id, dispatch]);
  console.log("subscriptionPlans", subscriptionPlan);
  useEffect(() => {
    if (subscriptionPlan) {
      form.setFieldsValue(subscriptionPlan);
    }
  }, [subscriptionPlan, form]);
  const onFinish = async (values: SubsptnPlans) => {
    try {
      const resultAction = await dispatch(
        updateSubscriptionPlan({ data: values, id })
      ).unwrap();
      toast.success(resultAction?.message);
      navigate("/super-admin/subscription-plans");

      // if (updateSubscriptionPlan.fulfilled.match(resultAction)) {
      //   toast.success("Plan updated successfully!");
      //   navigate("/super-admin/subscription-plans");
      // } else {
      //   const errorPayload = resultAction.payload as any;
      //   if (errorPayload?.error === "Plan name already exists.") {
      //     toast.error("Plan name already exists.");
      //   } else {
      //     toast.error("Failed to update Subscription Plan");
      //   }
      // }
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      toast.error(msg);
    }
  };
  return (
    <div className="max-w-1xl mx-auto bg-white rounded-lg shadow-md">
      <div>
        <Breadcrumbs
          paths={[
            {
              label: "Subscription Plans",
              path: "/super-admin/subscription-plans",
            },
            { label: "Edit Subscription Plan" },
          ]}
        />
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
          Edit Subscription Plan
        </h1>
      </div>

      <Card
        title="Edit Subscription Plan"
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Plan Name"
            name="planName"
            rules={[{ required: true, message: "Please enter the plan name" }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Price (₹)"
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Billing Cycle"
                name="billingCycle"
                rules={[
                  { required: true, message: "Please select billing cycle" },
                ]}
              >
                <Select
                  options={billingCycleOptions.map((cycle) => ({
                    label: cycle,
                    value: cycle,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Plan description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Number of Drivers"
                name="driverLimit"
                rules={[{ required: true, message: "Enter driver limit" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Number of Users"
                name="userLimit"
                rules={[{ required: true, message: "Enter user limit" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Number of Trucks"
                name="truckLimit"
                rules={[{ required: true, message: "Enter truck limit" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trial Days"
                name="trialDays"
                rules={[{ required: true, message: "Enter trial days" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  placeholder="Select status"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: "green", borderColor: "green" }}
              loading={loading}
            >
              Update Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditSubscriptionPlan;
