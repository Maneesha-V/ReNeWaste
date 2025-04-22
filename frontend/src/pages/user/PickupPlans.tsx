import { useEffect, useState } from "react";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchtPickupPlans } from "../../redux/slices/user/userPickupSlice";
import { Spin, Card, Row, Col, Empty, Button } from "antd";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import TrackModal from "../../components/user/TrackModal";

const { Meta } = Card;

const PickupPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrackingStatus, setSelectedTrackingStatus] = useState<string | null>(null);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("");
  const [selectedEta, setSelectedEta] = useState<{ text: string | null } | null>(null);
  const dispatch = useAppDispatch();
  const { pickups, loading, error } = useSelector(
    (state: RootState) => state.userPickups
  );
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
  }, [dispatch]);

  const handleTrackClick = (pickup: any) => {
    setSelectedPickupId(pickup.pickupId);
    setSelectedTrackingStatus(pickup.trackingStatus);
    setSelectedEta(pickup.eta); 
    setIsModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Pickup Plans</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : pickups.length === 0 ? (
          <Empty description="No pickup plans available." />
        ) : (
          <Row gutter={[16, 16]}>
            {Array.isArray(pickups) &&
              pickups.map((pickup: any, index: number) => (
                <Col key={index} xs={24}>
                  <Card
                    hoverable
                    title={pickup.pickupId}
                    className="rounded-lg shadow-lg"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => handleTrackClick(pickup)}
                      >
                        Track
                      </Button>
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
                          <p>
                            Pickup Time: {formatTimeTo12Hour(pickup.pickupTime)}
                          </p>
                          <p>Waste Type: {pickup.wasteType}</p>
                          <p>
                            Status:{" "}
                            <span
                              className={
                                pickup.trackingStatus
                                  ? "text-green-600"
                                  : "text-yellow-500"
                              }
                            >
                              {pickup.trackingStatus ?? "Not Assigned Yet"}
                            </span>
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
          </Row>
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
