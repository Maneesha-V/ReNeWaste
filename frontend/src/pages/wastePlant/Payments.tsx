import { Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  fetchPayments,
  triggerPickupRefund,
  updateRefundStatus,
} from "../../redux/slices/wastePlant/wastePlantPaymentSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { extractDateTimeParts } from "../../utils/formatDate";
import { PaymentRecord } from "../../types/paymentTypes";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import RefundModal from "../../components/wastePlant/RefundModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Payments = () => {
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(
    null
  );
  const [refundModalVisible, setRefundModalVisible] = useState(false);

  const dispatch = useAppDispatch();

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();

  const debouncedFetchPayments = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchPayments({ page, limit, search: query }));
    }, 500),
    [dispatch]
  );
  const refetchPayments = () => {
    dispatch(fetchPayments({ page: currentPage, limit: pageSize, search }));
  };

  useEffect(() => {
    debouncedFetchPayments(currentPage, pageSize, search);

    return () => {
      debouncedFetchPayments.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchPayments]);

  const { payments, total } = useSelector(
    (state: RootState) => state.wastePlantPayments
  );
  console.log("payments", payments);
  console.log("total", total);
  const dataWithSerial = payments.map((item: PaymentRecord, index: number) => ({
    ...item,
    key: index,
    serial: index + 1,
  }));
  const viewRefundDetails = (record: PaymentRecord) => {
    setSelectedRecord(record);
    setRefundModalVisible(true);
  };
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedRecord) {
      console.error("No selected record found.");
      return;
    }
    try {
      await dispatch(
        updateRefundStatus({
          pickupReqId: selectedRecord._id,
          status: newStatus,
        })
      ).unwrap();
      toast.success("Refund status updated successfully.");
      setRefundModalVisible(false);
      refetchPayments();
    } catch (error) {
      console.error("Failed to update refund status:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleRefund = async () => {
    if (!selectedRecord) return;
    console.log("Trigger actual refund for:", selectedRecord);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to refund ₹${selectedRecord.payment.amount} for Pickup ID ${selectedRecord.pickupId}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, refund it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(
          triggerPickupRefund({
            pickupReqId: selectedRecord._id,
            amount: selectedRecord.payment.amount,
            razorpayPaymentId: selectedRecord.payment.razorpayPaymentId,
          })
        ).unwrap();

        toast.success("Refund processed successfully.");
        setRefundModalVisible(false);
        refetchPayments();
      } catch (error) {
        console.error("Refund failed", error);
        toast.error("Refund failed.");
      }
    }
  };
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Payment Transactions
      </h2>
      <PaginationSearch
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onSearchChange={setSearch}
        searchValue={search}
      />
      <Table bordered pagination={false} dataSource={dataWithSerial}>
        <Table.Column title="S.No" dataIndex="serial" key="serial" />
        <Table.Column title="Pickup ID" dataIndex="pickupId" key="pickupId" />
        <Table.Column
          title="Waste Type"
          dataIndex="wasteType"
          key="wasteType"
        />
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
          title="Refund At"
          dataIndex={["payment", "refundAt"]}
          key="refundAt"
          render={(value) => {
            if(value !== null){
            const { date, time } = extractDateTimeParts(value);
            return (
              <div>
                <div>{date}</div>
                <div className="text-sm text-gray-500">{time}</div>
              </div>
            );
          }
          return null;
          }}
        />
        <Table.Column
          title="Payment Status"
          dataIndex={["payment", "status"]}
          key="status"
          render={(_, record: PaymentRecord) => {
            if (record.payment.refundRequested) {
              return record.payment.refundStatus || "Refund Requested";
            } else {
              return record.payment.status || "N/A";
            }
          }}
        />

        <Table.Column
          title="Action"
          key="action"
          render={(_, record: PaymentRecord) => {
            if (record.payment.refundRequested) {
              return (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => viewRefundDetails(record)}
                >
                  Refund Request
                </button>
              );
            }
            return null;
          }}
        />
      </Table>
      {selectedRecord && (
        <RefundModal
          visible={refundModalVisible}
          onClose={() => setRefundModalVisible(false)}
          record={selectedRecord}
          onUpdateStatus={handleStatusUpdate}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default Payments;
