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
  modifyCommercialPickup,
  updateCancelPickupStatus,
  updateModifyCancelButton,
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
  Tag,
  Divider,
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
import {
  modifyCommPickReq,
  PickupPlansResp,
} from "../../types/pickupReq/pickupTypes";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import PaginationSearch from "../../components/common/PaginationSearch";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import ModifyCommercialPickupModal from "../../components/user/ModifyCommercialPickupModal";
import { CalendarOutlined, CarOutlined, ClockCircleOutlined, CloseCircleOutlined, DollarOutlined, EditOutlined, EnvironmentOutlined, EyeOutlined, SyncOutlined, UserOutlined } from "@ant-design/icons";

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
    (state: RootState) => state.userPickups,
  );
  const location = useLocation();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelPickup, setCancelPickup] = useState<string | null>(null);
  const [modifyCommModalVisible, setModifyComModalVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<PickupPlansResp | null>(
    null,
  );
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

  useEffect(() => {
    const debouncedFetchPickupPlans = debounce(
      (page: number, limit: number, query: string, filter?: string) => {
        dispatch(fetchtPickupPlans({ page, limit, search: query, filter }));
      },
      500,
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
        }),
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
    console.log("---pickup", pickup);

    // if (
    //   pickup.wasteType === "Commercial" &&
    //   (pickup.status === "Scheduled" || pickup.status === "Rescheduled")
    // ) {
    //   setSelectedPickup(pickup);
    //   setModifyComModalVisible(true);
    //   return;
    // }

    if (pickup.payment?.status === "Paid") {
      setCancelPickup(pickup._id);
      setCancelModalVisible(true);
      return;
    }

    // if (pickup?.payment?.status === "Paid") {
    //   setCancelPickup(pickup._id);
    //   setCancelModalVisible(true);
    // }

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
  };
  const handleUpdate = (pickup: PickupPlansResp) => {
    setSelectedPickup(pickup);
    setModifyComModalVisible(true);
  };
  const handleModifyCommercialPickup = async (data: modifyCommPickReq) => {
    console.log("data--", data);

    try {
      const res = await dispatch(
        modifyCommercialPickup({
          pickupReqId: selectedPickup!._id,
          ...data,
        }),
      ).unwrap();
      dispatch(
        updateModifyCancelButton({
          pickupReqId: selectedPickup!._id,
          requestType: data.requestType,
        }),
      );
      console.log({ res });

      toast.success(res?.message);
      setSelectedPickup(null);
      setModifyComModalVisible(false);

      dispatch(
        fetchtPickupPlans({
          page: currentPage,
          limit: pageSize,
          search,
          filter: statusFilter,
        }),
      );
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
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
      // <Row gutter={[16, 16]}>
      //   {pickups.map((pickup: PickupPlansResp, index: number) => (
      //     <Col key={index} xs={24}>
      //       <Card
      //         hoverable
      //         title={pickup.pickupId}
      //         className="rounded-lg shadow-lg"
      //         extra={(() => {
      //           const status = pickup?.payment?.status;
      //           const expiresAt = pickup?.payment?.inProgressExpiresAt
      //             ? new Date(pickup?.payment?.inProgressExpiresAt)
      //             : null;
      //           const orderId = pickup?.payment?.razorpayOrderId;
      //           const now = new Date();

      //           const isCooldown = expiresAt && expiresAt > now;
      //           const isCooldownExpired = !expiresAt || expiresAt <= now;

      //           const isRetryCase = status === "Pending" && !!orderId;
      //           const today = new Date();
      //           today.setHours(0, 0, 0, 0);

      //           const pickupDate = new Date(pickup.originalPickupDate);
      //           pickupDate.setHours(0, 0, 0, 0);

      //           const canUpdate =
      //             pickup.status === "Pending" &&
      //             pickup.wasteType === "Commercial" &&
      //             pickup.requestType === null &&
      //             pickupDate > today;

      //           return (
      //             <>
      //               {/* PAY button only if not paid AND cooldown expired */}
      //               {(pickup.status === "Scheduled" ||
      //                 pickup.status === "Rescheduled") &&
      //               pickup.payment?.status !== "Paid" &&
      //               // status === "Pending" &&
      //               isCooldownExpired &&
      //               !isRetryCase ? (
      //                 <Button
      //                   type="primary"
      //                   className="mr-2"
      //                   onClick={() => handlePay(pickup)}
      //                 >
      //                   Pay
      //                 </Button>
      //               ) : status === "Pending" && isCooldown && !isRetryCase ? (
      //                 <div className="bg-orange-50 border border-orange-300 p-2 rounded text-sm text-orange-700 font-medium mb-2">
      //                   Payment already initiated. Please wait
      //                   {!isNaN(expiresAt.getTime()) && (
      //                     <>
      //                       {" "}
      //                       until{" "}
      //                       <strong>
      //                         {expiresAt.toLocaleTimeString([], {
      //                           hour: "2-digit",
      //                           minute: "2-digit",
      //                         })}
      //                       </strong>
      //                     </>
      //                   )}{" "}
      //                   to try again.
      //                 </div>
      //               ) : null}

      //               {/* TRACK or CANCEL button */}
      //               {pickup.status === "Cancelled" ||
      //               pickup.payment
      //                 ?.refundRequested ? null : pickup.trackingStatus ? (
      //                 <Button
      //                   type="primary"
      //                   onClick={() => handleTrackClick(pickup)}
      //                 >
      //                   {pickup.trackingStatus === "Completed" &&
      //                   pickup.payment?.status === "Paid"
      //                     ? "View"
      //                     : "Track"}
      //                 </Button>
      //               ) : (
      //                 !(status === "Pending" && isCooldown && !isRetryCase) && (
      //                   <Popconfirm
      //                     title="Are you sure to cancel this pickup?"
      //                     okText="Yes"
      //                     cancelText="No"
      //                     onConfirm={() => handleCancel(pickup)}
      //                     okType="danger"
      //                   >
      //                     <Button type="default" danger>
      //                       Cancel
      //                     </Button>
      //                   </Popconfirm>
      //                 )
      //               )}
      //               {/* UPDATE button */}
      //               {canUpdate && (
      //                 <Popconfirm
      //                   title="Are you sure to update this pickup?"
      //                   okText="Yes"
      //                   cancelText="No"
      //                   onConfirm={() => handleUpdate(pickup)}
      //                   okType="danger"
      //                 >
      //                   <Button type="primary" className="ml-2">
      //                     Update
      //                   </Button>
      //                 </Popconfirm>
      //               )}
      //             </>
      //           );
      //         })()}
      //       >
      //         <Meta
      //           title={`Pickup Date: ${
      //             pickup.rescheduledPickupDate
      //               ? formatDateToDDMMYYYY(pickup.rescheduledPickupDate)
      //               : formatDateToDDMMYYYY(pickup.originalPickupDate)
      //           }`}
      //           description={
      //             <>
      //               <p>Pickup Time: {formatTimeTo12Hour(pickup.pickupTime)}</p>
      //               <p>Waste Type: {pickup.wasteType}</p>

      //               {pickup?.payment?.status === "Paid" && (
      //                 <>
      //                   <p>
      //                     Payment Status:{" "}
      //                     <span className="text-green-600">
      //                       {pickup?.payment?.status}
      //                     </span>
      //                   </p>
      //                 </>
      //               )}
      //               <p>
      //                 Pickup Status:{" "}
      //                 <span
      //                   className={
      //                     pickup.status === "Scheduled" ||
      //                     pickup.status === "Rescheduled"
      //                       ? "text-green-600"
      //                       : pickup.status === "Completed"
      //                         ? "text-blue-600"
      //                         : pickup.status === "Cancelled"
      //                           ? "text-red-600"
      //                           : "text-yellow-500"
      //                   }
      //                 >
      //                   {pickup.status === "Scheduled" ||
      //                   pickup.status === "Rescheduled"
      //                     ? "Assigned Driver"
      //                     : pickup.status === "Completed"
      //                       ? "Completed"
      //                       : pickup.status === "Cancelled"
      //                         ? "Cancelled"
      //                         : "Not Assigned Yet"}
      //                 </span>
      //               </p>

      //               {pickup?.trackingStatus && (
      //                 <>
      //                   <p>Driver Name: {pickup?.driverId?.name}</p>
      //                   <p>Driver Contact: {pickup?.driverId?.contact}</p>
      //                   <p>Vehicle Name: {pickup?.truckId?.name}</p>
      //                   <p>Vehicle Number: {pickup?.truckId?.vehicleNumber}</p>
      //                 </>
      //               )}
      //             </>
      //           }
      //         />
      //       </Card>
      //     </Col>
      //   ))}
      // </Row>
<Row gutter={[16, 20]}>
  {pickups.map((pickup: PickupPlansResp, index: number) => {
    const paymentStatus = pickup?.payment?.status;

    const expiresAt = pickup?.payment?.inProgressExpiresAt
      ? new Date(pickup.payment.inProgressExpiresAt)
      : null;

    const orderId = pickup?.payment?.razorpayOrderId;
    const now = new Date();

    const isCooldown = expiresAt && expiresAt > now;
    const isCooldownExpired = !expiresAt || expiresAt <= now;

    const isRetryCase = paymentStatus === "Pending" && !!orderId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pickupDate = new Date(pickup.originalPickupDate);
    pickupDate.setHours(0, 0, 0, 0);

    const canUpdate =
      pickup.status === "Pending" &&
      pickup.wasteType === "Commercial" &&
      pickup.requestType === null &&
      pickupDate > today;

    const displayDate = pickup.rescheduledPickupDate
      ? pickup.rescheduledPickupDate
      : pickup.originalPickupDate;

    const statusConfig: Record<string, any> = {
      Pending: {
        color: "#d97706",
        bg: "#fffbeb",
        border: "#fcd34d",
        label: "Not Assigned Yet",
      },
      Scheduled: {
        color: "#15803d",
        bg: "#f0fdf4",
        border: "#86efac",
        label: "Assigned Driver",
      },
      Rescheduled: {
        color: "#0369a1",
        bg: "#f0f9ff",
        border: "#7dd3fc",
        label: "Rescheduled",
      },
      Completed: {
        color: "#0891b2",
        bg: "#ecfeff",
        border: "#67e8f9",
        label: "Completed",
      },
      Cancelled: {
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fca5a5",
        label: "Cancelled",
      },
    };

    const currentStatus = statusConfig[pickup.status] || {
      color: "#64748b",
      bg: "#f8fafc",
      border: "#cbd5e1",
      label: pickup.status,
    };

    return (
      <Col xs={24} key={index}>
        <Card
          hoverable
          className="overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300"
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          {/* =====================================================
              ECO HEADER
          ====================================================== */}
<div className="relative overflow-hidden bg-green-600 px-5 py-4">
  {/* Decorative circles */}
  <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-white/10" />
  <div className="absolute right-16 -bottom-10 h-24 w-24 rounded-full bg-white/10" />

  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Pickup ID */}
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-2xl">
        ♻️
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-green-50 mb-1">
          Waste Pickup
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-white m-0">
          {pickup.pickupId}
        </h2>
      </div>
    </div>

    {/* Status */}
    <div className="flex flex-wrap items-center gap-2">
      <Tag
        className="!m-0 rounded-full !border-0 px-4 py-1.5 font-semibold"
        style={{
          background: "white",
          color: currentStatus.color,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {currentStatus.label}
      </Tag>

      <Tag
        className="!m-0 rounded-full !border-0 px-4 py-1.5 font-semibold"
        style={{
          background:
            paymentStatus === "Paid"
              ? "#dcfce7"
              : paymentStatus === "Pending"
                ? "#fef3c7"
                : "#f1f5f9",
          color:
            paymentStatus === "Paid"
              ? "#15803d"
              : paymentStatus === "Pending"
                ? "#b45309"
                : "#64748b",
        }}
      >
        <DollarOutlined className="mr-1" />

        {paymentStatus === "Paid"
          ? "Paid"
          : paymentStatus === "Pending"
            ? "Payment Pending"
            : "Not Paid"}
      </Tag>
    </div>

  </div>
</div>

          {/* =====================================================
              CARD CONTENT
          ====================================================== */}
          <div className="p-5 md:p-6 bg-white">

            {/* =================================================
                PICKUP SUMMARY
            ================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {/* DATE */}
              <div className="group rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 transition hover:bg-emerald-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CalendarOutlined />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    Pickup Date
                  </span>
                </div>

                <p className="font-bold text-gray-800 m-0">
                  {formatDateToDDMMYYYY(displayDate)}
                </p>

                {pickup.rescheduledPickupDate && (
                  <p className="text-xs text-blue-600 mt-1 mb-0">
                    <SyncOutlined className="mr-1" />
                    Rescheduled
                  </p>
                )}
              </div>

              {/* TIME */}
              <div className="group rounded-xl border border-teal-100 bg-teal-50/70 p-4 transition hover:bg-teal-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <ClockCircleOutlined />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
                    Pickup Time
                  </span>
                </div>

                <p className="font-bold text-gray-800 m-0">
                  {formatTimeTo12Hour(pickup.pickupTime)}
                </p>
              </div>

              {/* WASTE TYPE */}
              <div className="group rounded-xl border border-lime-100 bg-lime-50/70 p-4 transition hover:bg-lime-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-100 text-lime-600 text-lg">
                    ♻
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-lime-700">
                    Waste Type
                  </span>
                </div>

                <p className="font-bold text-gray-800 m-0">
                  {pickup.wasteType}
                </p>
              </div>

              {/* DRIVER */}
              <div className="group rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 transition hover:bg-cyan-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <UserOutlined />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-cyan-700">
                    Driver
                  </span>
                </div>

                <p className="font-bold text-gray-800 m-0">
                  {pickup?.driverId?.name || "Not Assigned"}
                </p>
              </div>
            </div>

            {/* =================================================
                VEHICLE / DRIVER DETAILS
            ================================================== */}
            {pickup?.trackingStatus && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <EnvironmentOutlined />
                  </div>

                  <span className="font-semibold text-gray-700">
                    Pickup Vehicle Details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="flex items-center gap-3">
                    <UserOutlined className="text-green-600 text-lg" />

                    <div>
                      <p className="text-xs text-gray-400 m-0">
                        Driver Contact
                      </p>

                      <p className="text-sm font-semibold text-gray-700 m-0">
                        {pickup?.driverId?.contact || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CarOutlined className="text-teal-600 text-lg" />

                    <div>
                      <p className="text-xs text-gray-400 m-0">
                        Vehicle
                      </p>

                      <p className="text-sm font-semibold text-gray-700 m-0">
                        {pickup?.truckId?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <EnvironmentOutlined className="text-emerald-600 text-lg" />

                    <div>
                      <p className="text-xs text-gray-400 m-0">
                        Vehicle Number
                      </p>

                      <p className="text-sm font-semibold text-gray-700 m-0">
                        {pickup?.truckId?.vehicleNumber || "N/A"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                PAYMENT WAITING
            ================================================== */}
            {paymentStatus === "Pending" &&
              isCooldown &&
              !isRetryCase && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    ⏳
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-orange-800 m-0">
                      Payment already initiated
                    </p>

                    {!isNaN(expiresAt!.getTime()) && (
                      <p className="text-xs text-orange-700 mt-1 mb-0">
                        Please wait until{" "}
                        <strong>
                          {expiresAt!.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>{" "}
                        before trying again.
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* =================================================
                ACTIONS
            ================================================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-gray-100">

              {/* Small eco message */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-emerald-600">
                <span className="text-lg">🌱</span>
                <span className="font-medium">
                  Together for a cleaner environment
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-2">

                {/* PAY */}
                {(pickup.status === "Scheduled" ||
                  pickup.status === "Rescheduled") &&
                  paymentStatus !== "Paid" &&
                  isCooldownExpired &&
                  !isRetryCase && (
                    <Button
                      type="primary"
                      icon={<DollarOutlined />}
                      onClick={() => handlePay(pickup)}
                      className="!bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600"
                    >
                      Pay Now
                    </Button>
                  )}

                {/* TRACK / VIEW */}
                {pickup.status !== "Cancelled" &&
                  !pickup.payment?.refundRequested &&
                  pickup.trackingStatus && (
                    <Button
                      icon={
                        pickup.trackingStatus === "Completed" &&
                        paymentStatus === "Paid" ? (
                          <EyeOutlined />
                        ) : (
                          <EnvironmentOutlined />
                        )
                      }
                      onClick={() => handleTrackClick(pickup)}
                      className="!border-teal-500 !text-teal-600 hover:!border-teal-600 hover:!text-teal-700"
                    >
                      {pickup.trackingStatus === "Completed" &&
                      paymentStatus === "Paid"
                        ? "View"
                        : "Track Pickup"}
                    </Button>
                  )}

                {/* CANCEL */}
                {pickup.status !== "Cancelled" &&
                  !pickup.payment?.refundRequested &&
                  !pickup.trackingStatus &&
                  !(
                    paymentStatus === "Pending" &&
                    isCooldown &&
                    !isRetryCase
                  ) && (
                    <Popconfirm
                      title="Are you sure to cancel this pickup?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleCancel(pickup)}
                      okType="danger"
                    >
                      <Button
                        danger
                        icon={<CloseCircleOutlined />}
                      >
                        Cancel
                      </Button>
                    </Popconfirm>
                  )}

                {/* UPDATE */}
                {canUpdate && (
                  <Popconfirm
                    title="Are you sure to update this pickup?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleUpdate(pickup)}
                  >
                    <Button
                      icon={<EditOutlined />}
                      className="!border-emerald-500 !text-emerald-600 hover:!bg-emerald-50"
                    >
                      Update
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Col>
    );
  })}
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

        {selectedPickup && (
          <ModifyCommercialPickupModal
            open={modifyCommModalVisible}
            onClose={() => setModifyComModalVisible(false)}
            currentFrequency={selectedPickup.frequency}
            onSubmit={handleModifyCommercialPickup}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PickupPlans;
