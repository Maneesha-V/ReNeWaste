import { Form, Input, InputNumber, Select, Button, Card, Col, Row } from "antd";
import { validatePlanName } from "../../utils/superadminValidation";
import { SubsptnPlanData } from "../../types/subscriptionTypes";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { createSubscriptionPlan } from "../../redux/slices/superAdmin/superAdminSubscriptionPlanSlice";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const { TextArea } = Input;

const billingCycleOptions = ["Monthly", "Yearly"];
const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];
const AddSubscriptionPlan = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: SubsptnPlanData) => {
    console.log("Submitted values:", values);
    try {
      const resultAction = await dispatch(createSubscriptionPlan(values));

      if (createSubscriptionPlan.fulfilled.match(resultAction)) {
        toast.success("Subscription Plan added successfully!");
        form.resetFields();
        navigate("/super-admin/subscription-plans");
      } else {
        const errorPayload = resultAction.payload as any;
        console.log("err",errorPayload);
        
        if (errorPayload?.error === "Plan name already exists.") {
          toast.error("Plan name already exists.");
        } else {
          toast.error("Failed to add Subscription Plan");
        }
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="max-w-1xl mx-auto bg-white rounded-lg shadow-md">
      {/* Breadcrumbs and Header */}
      <div>
        <Breadcrumbs
          paths={[
            {
              label: "Subscription Plans",
              path: "/super-admin/subscription-plans",
            },
            { label: "Add Subscription Plan" },
          ]}
        />
        <h1 className="text-xl font-bold text-center mb-6 text-green-700">
          Add Subscription Plan
        </h1>
      </div>
      <Card
        title="Create Subscription Plan"
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            billingCycle: "Monthly",
            isActive: true,
          }}
        >
          <Form.Item
            label="Plan Name"
            name="planName"
            // rules={[{ required: true, message: "Please enter the plan name" }]}
            rules={[
              { required: true, message: "Please enter the plan name" },
              { validator: validatePlanName },
            ]}
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
                  { required: true, message: "Please select a billing cycle" },
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
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Short description of the plan" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Number of Drivers"
                name="driverLimit"
                rules={[
                  { required: true, message: "Please enter number of drivers" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Number of Users"
                name="userLimit"
                rules={[
                  { required: true, message: "Please enter number of users" },
                ]}
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
                rules={[
                  { required: true, message: "Please enter number of trucks" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trial Days"
                name="trialDays"
                rules={[
                  {
                    required: true,
                    message: "Please enter number of trial days",
                  },
                ]}
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
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Save Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddSubscriptionPlan;
