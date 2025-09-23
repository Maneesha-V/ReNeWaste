import { Table, Tag, Typography, Alert, Breakpoint, Pagination } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchPaymentHistory,
  refundPayment,
  updateRefundStatus,
  updateSubRefundStatus,
} from "../../redux/slices/superAdmin/superAdminPaymentSlice";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import { SubscriptionPaymentHisDTO } from "../../types/subscriptionPayment/paymentTypes";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import RefundModal from "../../components/superAdmin/RefundModal";
import Swal from "sweetalert2";

const { Title } = Typography;

const PaymentHistory = () => {
  const dispatch = useAppDispatch();
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<SubscriptionPaymentHisDTO>();
  const { payments, total, error } = useSelector(
    (state: RootState) => state.superAdminPayments
  );
  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  // const debouncedFetchPayments = useCallback(
  //   debounce((page: number, limit: number, query: string) => {
  //     dispatch(fetchPaymentHistory({ page, limit, search: query }));
  //   }, 500),
  //   [dispatch]
  // );
  const debouncedFetchPayments = useMemo( 
    () => 
       debounce((page: number, limit: number, query: string) => {
      dispatch(fetchPaymentHistory({ page, limit, search: query }));
    }, 500),
    []
  )
  useEffect(() => {
    debouncedFetchPayments(currentPage, pageSize, search);
    return () => {
      debouncedFetchPayments.cancel();
    };
  }, [currentPage, pageSize, search]);
  const handleView = (record: SubscriptionPaymentHisDTO) => {
    setSelectedRecord(record);
    setRefundModalVisible(true);
  };
  const handleRefundStart = async (
    _id: string,
    newStatus: string,
    record: SubscriptionPaymentHisDTO
  ) => {
    try {
      const res = await dispatch(
        updateRefundStatus({
          subPayId: _id,
          refundStatus: newStatus,
        })
      ).unwrap();
      if (res.statusUpdate) {
        dispatch(updateSubRefundStatus(res.statusUpdate));
      }
      // toast.success(res.message);

      setSelectedRecord({ ...record, refundStatus: newStatus });
      setRefundModalVisible(true);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };
  const handleRefundProcess = async (record: SubscriptionPaymentHisDTO) => {
    console.log("Trigger actual refund for:", record);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to refund ₹${record.amount} for the ${record.planId.planName} Plan of ${record.wasteplantId.plantName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, refund it!",
    });

    if (result.isConfirmed) {
      try {
        setSelectedRecord(record);
        setRefundModalVisible(true);
        const res = await dispatch(
          refundPayment({
            subPayId: record._id,
            refundStatus: "Refunded",
          })
        ).unwrap();
        console.log("res", res);

        dispatch(updateSubRefundStatus(res.statusUpdate));
        toast.success(res.message);
        setRefundModalVisible(false);
      } catch (error) {
        toast.error(getAxiosErrorMessage(error));
      }
    }
  };
  const columns = [
    {
      title: "Waste Plant",
      dataIndex: ["wasteplantId", "plantName"],
      key: "plantName",
      responsive: ["xs", "sm", "md"] as Breakpoint[],
    },
    {
      title: "Plan",
      dataIndex: ["planId", "planName"],
      key: "planName",
      responsive: ["xs", "sm", "md"] as Breakpoint[],
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount}`,
      responsive: ["sm", "md"] as Breakpoint[],
    },
    {
      title: "Paid Date",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (date: string | null) => formatDateToDDMMYYYY(date),
    },
    {
      title: "Expiry At",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date: string | null) => formatDateToDDMMYYYY(date),
    },
    ...(payments.some((p) => p.refundAt)
      ? [
          {
            title: "Refund At",
            dataIndex: "refundAt",
            key: "refundAt",
            render: (date: string | null) => formatDateToDDMMYYYY(date),
          },
        ]
      : []),

    {
      title: "Payment Status",
      // dataIndex: "status",
      key: "status",
      render: (record: SubscriptionPaymentHisDTO) => {
        const statusToShow = record.refundStatus || record.status;
        return statusToShow ? <Tag>{statusToShow}</Tag> : null;
      },
    },
    ...(payments.some((p) => p.refundRequested)
      ? [
          {
            title: "Action",
            key: "action",
            render: (record: SubscriptionPaymentHisDTO) => {
              console.log("record", record);

              const { refundRequested, refundStatus } = record;
              if (refundRequested && !refundStatus) {
                record.refundStatus = "Pending";
                return (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() =>
                      handleRefundStart(record._id, record.refundStatus, record)
                    }
                  >
                    Start Refund
                  </button>
                );
              } else if (refundStatus) {
                if (
                  refundStatus === "Refunded" ||
                  refundStatus === "Rejected"
                ) {
                  return (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleView(record)}
                    >
                      View
                    </button>
                  );
                } else {
                  return (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        handleRefundStart(
                          record._id,
                          record.refundStatus,
                          record
                        )
                      }
                    >
                      Process Refund
                    </button>
                  );
                }
              }
              return null;
            },
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: "16px" }}>
      <Title level={4}>Subscription Payment History</Title>

      {error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <>
          <PaginationSearch onSearchChange={setSearch} searchValue={search} />
          <Table
            columns={columns}
            dataSource={payments.map((item: SubscriptionPaymentHisDTO) => ({
              ...item,
              key: item._id,
            }))}
            pagination={false}
            scroll={{ x: "max-content" }}
            bordered
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={setCurrentPage}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        </>
      )}
      {selectedRecord && (
        <RefundModal
          visible={refundModalVisible}
          onClose={() => setRefundModalVisible(false)}
          record={selectedRecord}
          onUpdateStatus={handleRefundStart}
          onRefund={handleRefundProcess}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
