import { useCallback, useEffect, useState } from "react";
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
} from "../../redux/slices/user/userPickupSlice";
import {
  Spin,
  Card,
  Row,
  Col,
  Empty,
  Button,
  Popconfirm,
  Tabs,
  Modal,
  Pagination,
} from "antd";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import TrackModal from "../../components/user/TrackModal";
import { useLocation } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import { setPaymentData } from "../../redux/slices/user/userPaymentSlice";
import PayNow from "./PayNow";
import InputMessage from "../../components/common/InputMessage";
import { PickupPlansResp } from "../../types/pickupReq/pickupTypes";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import PaginationSearch from "../../components/common/PaginationSearch";

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
  // const [activeTab, setActiveTab] = useState<string>("1");

  const dispatch = useAppDispatch();
  const { pickups, total, loading, error } = useSelector(
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

  const debouncedFetchPickupPlans = useCallback(
    debounce((page: number, limit: number, query: string, filter?: string) => {
      dispatch(fetchtPickupPlans({ page, limit, search: query, filter }));
    }, 500),
    [dispatch]
  );
  useEffect(() => {
    debouncedFetchPickupPlans(currentPage, pageSize, search, statusFilter);
    return () => {
      debouncedFetchPickupPlans.cancel();
    };
  }, [currentPage, pageSize, search, statusFilter, debouncedFetchPickupPlans]);
  
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
}, [shouldRefresh]);

  const handleTrackClick = (pickup: any) => {
    if (!pickup || !pickup.pickupId) return null;
    setSelectedPickupId(pickup.pickupId);
    setSelectedTrackingStatus(pickup.trackingStatus);
    setSelectedEta(pickup.eta);
    setIsModalOpen(true);
  };
  const handleCancel = async (pickup: any) => {
    if (pickup?.payment?.status === "Paid") {
      setCancelPickup(pickup._id);
      setCancelModalVisible(true);
    } else {
      try {
        await dispatch(cancelPickupPlan(pickup._id)).unwrap();
        toast.success("Pickup plan cancelled");
        setSelectedPickupId("");
        setSelectedTrackingStatus(null);
        setSelectedEta(null);
        setIsModalOpen(false);
        await dispatch(
          fetchtPickupPlans({
            page: currentPage,
            limit: pageSize,
            search,
            filter: statusFilter,
          })
        );
      } catch (err: any) {
        toast.error(err?.message || "Failed to cancel pickup");
      }
    }
  };
  const handlePay = async (pickup: PickupPlansResp) => {
    console.log("pickup", pickup);

    const amount = pickup.wasteType === "Residential" ? 100 : 200;
    dispatch(setPaymentData({ pickup, amount }));
    setIsPayNowModalOpen(true);
  };

  const renderPickupCards = (filteredPickups: any[]) => {
    if (filteredPickups.length === 0) {
      return <Empty description="No pickup plans available." />;
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredPickups.map((pickup: any, index: number) => (
          <Col key={index} xs={24}>
            <Card
              hoverable
              title={pickup.pickupId}
              className="rounded-lg shadow-lg"
              extra={(() => {
                const status = pickup?.payment?.status;
                const expiresAt = pickup?.payment?.inProgressExpiresAt;
                const now = new Date();
                const isExpired =
                  status === "InProgress" &&
                  expiresAt &&
                  new Date(expiresAt) <= now;

                return (
                  <>
                    {/* PAY Button */}
                    {(pickup.status === "Scheduled" ||
                      pickup.status === "Rescheduled") &&
                    (!status || status === "Pending" || isExpired) ? (
                      <Button
                        type="primary"
                        className="mr-2"
                        onClick={() => handlePay(pickup)}
                      >
                        Pay
                      </Button>
                    ) : status === "InProgress" && !isExpired ? (
                      <div className="bg-orange-50 border border-orange-300 p-2 rounded text-sm text-orange-700 font-medium mb-2">
                        Payment already initiated. Please wait until{" "}
                        <strong>
                          {new Date(expiresAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>{" "}
                        to try again.
                      </div>
                    ) : null}

                    {/* TRACK or CANCEL button */}
                    {pickup.status ===
                    "Cancelled" ? null : pickup.trackingStatus ? (
                      <Button
                        type="primary"
                        onClick={() => handleTrackClick(pickup)}
                      >
                        {pickup.trackingStatus === "Completed"
                          ? "View"
                          : "Track"}
                      </Button>
                    ) : (
                      !(status === "InProgress" && !isExpired) && (
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

              // extra={
              //   <>
              //     {(() => {
              //       const status = pickup?.payment?.status;
              //       const expiresAt = pickup?.payment?.inProgressExpiresAt;
              //       const now = new Date();
              //       const isExpired =
              //         status === "InProgress" &&
              //         expiresAt &&
              //         new Date(expiresAt) <= now;

              //       if (
              //         (pickup.status === "Scheduled" ||
              //           pickup.status === "Rescheduled") &&
              //         (!status || status === "Pending" || isExpired)
              //       ) {
              //         return (
              //           <Button
              //             type="primary"
              //             className="mr-2"
              //             onClick={() => handlePay(pickup)}
              //           >
              //             Pay
              //           </Button>
              //         );
              //       } else if (status === "InProgress" && !isExpired) {
              //         return (
              //           <div className="bg-orange-50 border border-orange-300 p-2 rounded text-sm text-orange-700 font-medium mb-2">
              //             Payment already initiated. Please wait until{" "}
              //             <strong>
              //               {new Date(expiresAt).toLocaleTimeString([], {
              //                 hour: "2-digit",
              //                 minute: "2-digit",
              //               })}
              //             </strong>{" "}
              //             to try again.
              //           </div>
              //         );
              //       }

              //       return null;
              //     })()}

              //     {pickup.status ===
              //     "Cancelled" ? null : pickup.trackingStatus ? (
              //       <Button
              //         type="primary"
              //         onClick={() => handleTrackClick(pickup)}
              //       >
              //         {pickup.trackingStatus === "Completed" ? "View" : "Track"}
              //       </Button>
              //     ) : (
              //       <Popconfirm
              //         title="Are you sure to cancel this pickup?"
              //         okText="Yes"
              //         cancelText="No"
              //         onConfirm={() => handleCancel(pickup)}
              //         okType="danger"
              //       >
              //         <Button type="default" danger>
              //           Cancel
              //         </Button>
              //       </Popconfirm>
              //     )}
              //   </>
              // }
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

  // const pendingPickups = pickups.filter(
  //   (p: any) =>
  //     !p.trackingStatus &&
  //     p.status !== "Cancelled" &&
  //     p.payment?.status !== "Pending"
  // );
  // const processedPickups = pickups.filter(
  //   (p: any) => p.trackingStatus && p.status !== "Cancelled"
  // );
  // const cancelledPickups = pickups.filter((p: any) => p.status === "Cancelled");

  const filteredPickups = pickups.filter((pickup: any) => {
    const matchesSearch =
      search === "" ||
      pickup.pickupId?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      statusFilter === "All" || pickup.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Pickup Plans</h2>
        {/* <PaginationSearch searchValue={search} onSearchChange={setSearch} /> */}

        <PaginationSearch
          searchValue={search}
          onSearchChange={setSearch}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { value: "All", label: "All" },
            { value: "Pending", label: "Pending" },
            { value: "Scheduled", label: "Scheduled" },
            { value: "Rescheduled", label: "Rescheduled" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
        {loading ? (
          <div className="text-center mt-4">
            <Spin />
          </div>
        ) : filteredPickups.length > 0 ? (
          renderPickupCards(filteredPickups)
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No pickup plans found"
            className="mt-4"
          />
        )}
        {/* {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Pending Pickups" key="1">
              {renderPickupCards(pendingPickups)}
            </TabPane>
            <TabPane tab="Processed Pickups" key="2">
              {renderPickupCards(processedPickups)}
            </TabPane>
            <TabPane tab="Cancelled Pickups" key="3">
              {renderPickupCards(cancelledPickups)}
            </TabPane>
          </Tabs>
        )} */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          showSizeChanger={false}
          style={{ marginTop: 16 }}
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
          onSuccess={() =>
            dispatch(
              fetchtPickupPlans({
                page: currentPage,
                limit: pageSize,
                search,
                filter: statusFilter,
              })
            )
          }
        />
      </div>
      <Footer />
    </div>
  );
};

export default PickupPlans;
