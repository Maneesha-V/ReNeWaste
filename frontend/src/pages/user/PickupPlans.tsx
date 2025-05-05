import { useEffect, useState } from "react";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  cancelPickupPlan,
  fetchtPickupPlans,
} from "../../redux/slices/user/userPickupSlice";
import { Spin, Card, Row, Col, Empty, Button, Popconfirm, Tabs } from "antd";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import TrackModal from "../../components/user/TrackModal";
import { useLocation } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";

const { Meta } = Card;

const PickupPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrackingStatus, setSelectedTrackingStatus] = useState<
    string | null
  >(null);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("");
  const [selectedEta, setSelectedEta] = useState<{
    text: string | null;
  } | null>(null);
  const dispatch = useAppDispatch();
  const { pickups, loading, error } = useSelector(
    (state: RootState) => state.userPickups
  );
  const location = useLocation();
  console.log("pickups", pickups);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        await dispatch(fetchtPickupPlans());
      } catch (err: any) {
        toast.error("Error fetching pickup plans");
      }
    };

    fetchPickups();
  }, [dispatch, location.pathname]);

  const handleTrackClick = (pickup: any) => {
    setSelectedPickupId(pickup.pickupId);
    setSelectedTrackingStatus(pickup.trackingStatus);
    setSelectedEta(pickup.eta);
    setIsModalOpen(true);
  };
  const handleCancel = async (pickupReqId: string) => {
    try {
      await dispatch(cancelPickupPlan(pickupReqId)).unwrap();
      toast.success("Pickup plan cancelled");
    } catch (err: any) {
      toast.error(err);
    }
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
              extra={
                pickup.trackingStatus ? (
                  <Button type="primary" onClick={() => handleTrackClick(pickup)}>
                    Track
                  </Button>
                ) : (
                  <Popconfirm
                    title="Are you sure to cancel this pickup?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleCancel(pickup._id)}
                    okType="danger"
                  >
                    <Button type="default" danger>
                      Cancel
                    </Button>
                  </Popconfirm>
                )
              }
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
                    <p>
                      Pickup Status:{" "}
                      <span className={pickup.status === "Scheduled" ? "text-green-600" : "text-yellow-500"}>
                        {pickup.status === "Scheduled" ? "Assigned Driver" : "Not Assigned Yet"}
                      </span>
                    </p>

                    {pickup?.trackingStatus && (
                      <>
                        <p>Driver Name: {pickup?.driverId?.name}</p>
                        <p>Driver Contact: {pickup?.driverId?.contact}</p>
                        <p>Vehicle Name: {pickup?.driverId?.assignedTruckId?.name}</p>
                        <p>Vehicle Number: {pickup?.driverId?.assignedTruckId?.vehicleNumber}</p>
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

  const pendingPickups = pickups.filter((p: any) => !p.trackingStatus);
  const proceesedPickups = pickups.filter((p: any) => p.trackingStatus);

  return (
    <div className="min-h-screen bg-green-100">
      <Header />
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Pickup Plans</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Pending Pickups" key="1">
              {renderPickupCards(pendingPickups)}
            </TabPane>
            <TabPane tab="Processed Pickups" key="2">
              {renderPickupCards(proceesedPickups)}
            </TabPane>
          </Tabs>
        )}

        <TrackModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trackingStatus={selectedTrackingStatus}
          pickupId={selectedPickupId}
          eta={selectedEta}
        />
      </div>
      <Footer />
    </div>
  );
};

 

export default PickupPlans;
