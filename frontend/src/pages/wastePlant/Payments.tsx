import { Table } from "antd";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { fetchPayments } from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { extractDateTimeParts } from "../../utils/formatDate";
import { PaymentRecord } from "../../types/paymentTypes";

const Payments = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);
  const { payments } = useSelector(
    (state: RootState) => state.wastePlantPayments
  );
  console.log("payments", payments);
  const dataWithSerial = payments.map((item: PaymentRecord, index: number) => ({
    ...item,
    key: index,
    serial: index + 1,
  }));
const handleRefund = (pickupId: string) => {
  // Replace with actual refund logic
  console.log("Processing refund for", pickupId);
  // dispatch(triggerRefund(pickupId)); // if you have a thunk
};

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Payment Transactions
      </h2>
      <Table bordered pagination={{ pageSize: 8 }} dataSource={dataWithSerial}>
        <Table.Column title="S.No" dataIndex="serial" key="serial" />
        <Table.Column title="Pickup ID" dataIndex="pickupId" key="pickupId" />
        <Table.Column title="Waste Type" dataIndex="wasteType" key="wasteType" />
        <Table.Column title="User Name" dataIndex="userName" key="userName" />
        <Table.Column
          title="Assigned Driver"
          dataIndex="driverName"
          key="driverName"
        />
        <Table.Column
          title="Payment Amount"
          dataIndex={["payment", "amount"]}
          key="amount"
        />
        <Table.Column
          title="Due Date"
          dataIndex="dueDate"
          key="dueDate"
          render={(value) => {
            const { date, time } = extractDateTimeParts(value);
            return (
              <div>
                <div>{date}</div>
                <div className="text-sm text-gray-500">{time}</div>
              </div>
            );
          }}
        />
        <Table.Column
          title="Paid At"
          dataIndex={["payment", "paidAt"]}
          key="paidAt"
          render={(value) => {
            const { date, time } = extractDateTimeParts(value);
            return (
              <div>
                <div>{date}</div>
                <div className="text-sm text-gray-500">{time}</div>
              </div>
            );
          }}
        />
                <Table.Column
          title="Payment Status"
          dataIndex={["payment", "status"]}
          key="status"
        />
        
<Table.Column
  title="Action"
  key="action"
  render={(_, record: PaymentRecord) => {
    if (record.payment.refundRequested && record.payment.refundStatus !== "Refunded") {
      return (
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          onClick={() => handleRefund(record._id)}
        >
          Refund
        </button>
      );
    }
    return null;
  }}
/>
      </Table>
    </div>
  );
};

export default Payments;
