import React from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { createDropSpot } from '../../redux/slices/wastePlant/wastePlantDropSpotSlice';
import { useAppDispatch } from '../../redux/hooks';
import { toast } from 'react-toastify';

const AddDropSpot: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch= useAppDispatch();

const onFinish = async (values: any) => {
  try {
    const resultAction = await dispatch(createDropSpot(values));

    if (createDropSpot.fulfilled.match(resultAction)) {
      toast.success('Drop Spot added successfully!');
      form.resetFields(); 
    } else {
      toast.error('Failed to add Drop Spot');
    }
  } catch (err) {
    toast.error('Something went wrong');
  }
};

  return (
    <Card title="Add Drop Spot" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          state: 'Kerala',
          district: 'Malappuram'
        }}
      >
        <Form.Item
          label="Drop Spot Name"
          name="dropSpotName"
          rules={[{ required: true, message: 'Please enter the drop spot name' }]}
        >
          <Input placeholder="Enter drop spot name" />
        </Form.Item>

        <Form.Item
          label="Address Line"
          name="addressLine"
          rules={[{ required: true, message: 'Please enter address line' }]}
        >
          <Input placeholder="Address line" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input placeholder="Location" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[{ required: true, message: 'Please enter pincode' }]}
            >
              <Input placeholder="Pincode" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
<Button 
  type="primary" 
  htmlType="submit" 
  block 
  style={{ backgroundColor: 'green', borderColor: 'green' }}
>
  Add Drop Spot
</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddDropSpot;
