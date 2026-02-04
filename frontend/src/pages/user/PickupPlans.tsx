import { useEffect, useState } from "react";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  cancelPickupPlan,
  cancelPickupReq,
  fetchtPickupPlans,
  updateCancelPickupStatus,
} from "../../redux/slices/user/userPickupSlice";
import {
  Spin,
  Card,
  Row,
  Col,
  Empty,
  Button,
  Popconfirm,
  Modal,
  Pagination,
} from "antd";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import TrackModal from "../../components/user/TrackModal";
import { useLocation } from "react-router-dom";
import { setPaymentData } from "../../redux/slices/user/userPaymentSlice";
import PayNow from "./PayNow";
import InputMessage from "../../components/common/InputMessage";
import { PickupPlansResp } from "../../types/pickupReq/pickupTypes";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import PaginationSearch from "../../components/common/PaginationSearch";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const { Meta } = Card;

const PickupPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayNowModalOpen, setIsPayNowModalOpen] = useState(false);
  const [selectedTrackingStatus, setSelectedTrackingStatus] = useState<
    string | null
  >(null);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("");
  const [selectedEta, setSelectedEta] = useState<{
    text: string | null;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { pickups, total, loading } = useSelector(
    (state: RootState) => state.userPickups
  );
  const location = useLocation();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelPickup, setCancelPickup] = useState<string | null>(null);

  console.log("pickups", pickups);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = usePagination();

  // const debouncedFetchPickupPlans = useCallback(
  //   debounce((page: number, limit: number, query: string, filter?: string) => {
  //     dispatch(fetchtPickupPlans({ page, limit, search: query, filter }));
  //   }, 500),
  //   [dispatch]
  // );
  useEffect(() => {
    const debouncedFetchPickupPlans = debounce(
      (page: number, limit: number, query: string, filter?: string) => {
        dispatch(fetchtPickupPlans({ page, limit, search: query, filter }));
      },
      500
    );
    debouncedFetchPickupPlans(currentPage, pageSize, search, statusFilter);
    return () => {
      debouncedFetchPickupPlans.cancel();
    };
  }, [dispatch, currentPage, pageSize, search, statusFilter]);

  const shouldRefresh = location.state?.refresh;
  useEffect(() => {
    if (shouldRefresh) {
      dispatch(
        fetchtPickupPlans({
          page: currentPage,
          limit: pageSize,
          search,
          filter: statusFilter,
        })
      );
    }
  }, [shouldRefresh, currentPage, pageSize, search, statusFilter, dispatch]);

  const handleTrackClick = (pickup: PickupPlansResp) => {
    if (!pickup || !pickup.pickupId) return null;
    setSelectedPickupId(pickup.pickupId);
    setSelectedTrackingStatus(pickup.trackingStatus);
    setSelectedEta(pickup.eta);
    setIsModalOpen(true);
  };
  const handleCancel = async (pickup: PickupPlansResp) => {
    if (pickup?.payment?.status === "Paid") {
      setCancelPickup(pickup._id);
      setCancelModalVisible(true);
    } else {
      try {
        const res = await dispatch(cancelPickupPlan(pickup._id)).unwrap();
        toast.success(res.message);
        setSelectedPickupId("");
        setSelectedTrackingStatus(null);
        setSelectedEta(null);
        setIsModalOpen(false);
        await dispatch(updateCancelPickupStatus({ pickupReqId: pickup._id }));
      } catch (err) {
        toast.error(getAxiosErrorMessage(err));
      }
    }
  };
  const handlePay = async (pickup: PickupPlansResp) => {
    console.log("pickup", pickup);

    const amount = pickup.wasteType === "Residential" ? 100 : 200;
    dispatch(setPaymentData({ pickup, amount }));
    setIsPayNowModalOpen(true);
  };

  const renderPickupCards = (pickups: PickupPlansResp[]) => {
    if (pickups.length === 0) {
      return <Empty description="No pickup plans available." />;
    }

    return (
      <Row gutter={[16, 16]}>
        {pickups.map((pickup: PickupPlansResp, index: number) => (
          <Col key={index} xs={24}>
            <Card
              hoverable
              title={pickup.pickupId}
              className="rounded-lg shadow-lg"
              extra={(() => {
                const status = pickup?.payment?.status;
                const expiresAt = pickup?.payment?.inProgressExpiresAt
                  ? new Date(pickup?.payment?.inProgressExpiresAt)
                  : null;
                const orderId = pickup?.payment?.razorpayOrderId;
                const now = new Date();

                const isCooldown = expiresAt && expiresAt > now;
                const isCooldownExpired = !expiresAt || expiresAt <= now;

                const isRetryCase = status === "Pending" && !!orderId;

                return (
                  <>
                    {/* PAY button only if not paid AND cooldown expired */}
                    {(pickup.status === "Scheduled" ||
                      pickup.status === "Rescheduled") &&
                    pickup.payment?.status !== "Paid" &&
                    // status === "Pending" &&
                    isCooldownExpired &&
                    !isRetryCase ? (
                      <Button
                        type="primary"
                        className="mr-2"
                        onClick={() => handlePay(pickup)}
                      >
                        Pay
                      </Button>
                    ) : status === "Pending" && isCooldown && !isRetryCase ? (
                      <div className="bg-orange-50 border border-orange-300 p-2 rounded text-sm text-orange-700 font-medium mb-2">
                        Payment already initiated. Please wait
                        {!isNaN(expiresAt.getTime()) && (
                          <>
                            {" "}
                            until{" "}
                            <strong>
                              {expiresAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>
                          </>
                        )}{" "}
                        to try again.
                      </div>
                    ) : null}

                    {/* TRACK or CANCEL button */}
                    {pickup.status === "Cancelled" ||
                    pickup.payment
                      ?.refundRequested ? null : pickup.trackingStatus ? (
                      <Button
                        type="primary"
                        onClick={() => handleTrackClick(pickup)}
                      >
                        {pickup.trackingStatus === "Completed" &&
                        pickup.payment.status === "Paid"
                          ? "View"
                          : "Track"}
                      </Button>
                    ) : (
                      !(status === "Pending" && isCooldown && !isRetryCase) && (
                        <Popconfirm
                          title="Are you sure to cancel this pickup?"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => handleCancel(pickup)}
                          okType="danger"
                        >
                          <Button type="default" danger>
                            Cancel
                          </Button>
                        </Popconfirm>
                      )
                    )}
                  </>
                );
              })()}
            >
              <Meta
                title={`Pickup Date: ${
                  pickup.rescheduledPickupDate
                    ? formatDateToDDMMYYYY(pickup.rescheduledPickupDate)
                    : formatDateToDDMMYYYY(pickup.originalPickupDate)
                }`}
                description={
                  <>
                    <p>Pickup Time: {formatTimeTo12Hour(pickup.pickupTime)}</p>
                    <p>Waste Type: {pickup.wasteType}</p>

                    {pickup?.payment?.status === "Paid" && (
                      <>
                        <p>
                          Payment Status:{" "}
                          <span className="text-green-600">
                            {pickup?.payment?.status}
                          </span>
                        </p>
                      </>
                    )}
                    <p>
                      Pickup Status:{" "}
                      <span
                        className={
                          pickup.status === "Scheduled" ||
                          pickup.status === "Rescheduled"
                            ? "text-green-600"
                            : pickup.status === "Completed"
                            ? "text-blue-600"
                            : pickup.status === "Cancelled"
                            ? "text-red-600"
                            : "text-yellow-500"
                        }
                      >
                        {pickup.status === "Scheduled" ||
                        pickup.status === "Rescheduled"
                          ? "Assigned Driver"
                          : pickup.status === "Completed"
                          ? "Completed"
                          : pickup.status === "Cancelled"
                          ? "Cancelled"
                          : "Not Assigned Yet"}
                      </span>
                    </p>

                    {pickup?.trackingStatus && (
                      <>
                        <p>Driver Name: {pickup?.driverId?.name}</p>
                        <p>Driver Contact: {pickup?.driverId?.contact}</p>
                        <p>Vehicle Name: {pickup?.truckId?.name}</p>
                        <p>Vehicle Number: {pickup?.truckId?.vehicleNumber}</p>
                      </>
                    )}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Pickup Plans</h2>

        <PaginationSearch
          searchValue={search}
          onSearchChange={setSearch}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
        />
        {loading ? (
          <div className="text-center mt-4">
            <Spin />
          </div>
        ) : pickups.length > 0 ? (
          renderPickupCards(pickups)
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No pickup plans found"
            className="mt-4"
          />
        )}

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          showSizeChanger={false}
          style={{ marginTop: 16, textAlign: "right" }}
        />
        {isModalOpen && selectedPickupId && (
          <TrackModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            trackingStatus={selectedTrackingStatus}
            pickupId={selectedPickupId}
            eta={selectedEta}
          />
        )}
        <Modal
          open={isPayNowModalOpen}
          onCancel={() => setIsPayNowModalOpen(false)}
          footer={null}
          destroyOnClose
          width={600}
        >
          <PayNow onClose={() => setIsPayNowModalOpen(false)} />
        </Modal>
        <InputMessage
          visible={cancelModalVisible}
          onClose={() => setCancelModalVisible(false)}
          pickupId={cancelPickup}
          cancelAction={cancelPickupReq}
        />
      </div>
      <Footer />
    </div>
  );
};

export default PickupPlans;
