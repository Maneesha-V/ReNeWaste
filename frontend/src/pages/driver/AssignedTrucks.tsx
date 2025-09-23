import React, { useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Card,
  Space,
  Empty,
  Popconfirm,
} from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import {
  fetchDriverTrucks,
  markTruckReturned,
  reqTruckByDriver,
} from "../../redux/slices/driver/truckDriverSlice";
import { fetchDriverProfile } from "../../redux/slices/driver/profileDriverSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { TruckAvailbleDTO } from "../../types/truck/truckTypes";

const { Title, Text } = Typography;

const AssignedTrucks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const { availableTrucks } = useSelector((state: RootState) => state.driverTrucks);
  const hasRequested = useSelector(
    (state: RootState) => state.driverTrucks.hasRequestedTruck
  );
  console.log("driver", driver);
  console.log("trucks", availableTrucks);

  useEffect(() => {
    if (!driver) {
      dispatch(fetchDriverProfile());
    }
  }, [driver, dispatch]);

  useEffect(() => {
    if (driver && driver.wasteplantId) {
      dispatch(fetchDriverTrucks(driver.wasteplantId));
    }
  }, [dispatch, driver]);

  const handleRequestTruck = () => {
    dispatch(reqTruckByDriver())
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((err) => {
        toast.error(getAxiosErrorMessage(err));
      });
  };
  const handleMarkReturned = (truckId: string, plantId: string) => {
    dispatch(markTruckReturned({ truckId, plantId }))
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        // dispatch(fetchDriverTrucks(driver.wasteplantId));
      })
      .catch((err) => {
        toast.error(getAxiosErrorMessage(err));
      });
  };

  const columns = [
    {
      title: "Truck Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Address",
      key: "address",
      render: (record: TruckAvailbleDTO) => {
        const wp = record.wasteplantId;
        return wp
          ? `${wp.plantName}, ${wp.location}, ${wp.taluk}, ${wp.district}, ${wp.state} - ${wp.pincode}`
          : "N/A";
      },
    },
    {
      title: "Status",
      key: "status",
      render: (record: TruckAvailbleDTO) => {
        if (record.status === "Maintenance") {
          return (
            <Button
              type="primary"
              onClick={() => handleRequestTruck()}
              disabled={hasRequested}
            >
              {hasRequested ? "Request Sent" : "Request Truck"}
            </Button>
          );
        }
        return <span style={{ color: "green" }}>{record.status}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: TruckAvailbleDTO) => {
        const isReturned = record?.isReturned;
        return (
          <Popconfirm
            title="Are you sure you want to return the truck?"
            onConfirm={() =>
              handleMarkReturned(record._id, record.wasteplantId._id)
            }
            okText="Yes"
            cancelText="No"
            disabled={isReturned}
          >
            <Button
              type="primary"
              disabled={isReturned}
            >
              {isReturned ? "Returned" : "Mark Returned"}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <div className="w-full">
      <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
        Assigned Trucks
      </Title>

      <Card bodyStyle={{ padding: "16px" }} bordered={false}>
        {availableTrucks && availableTrucks.length > 0 ? (
          <Table
            columns={columns}
            dataSource={availableTrucks.map((truck: TruckAvailbleDTO, index: number) => ({
              ...truck,
              key: index.toString(),
            }))}
            pagination={false}
          />
        ) : (
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", textAlign: "center", marginTop: "40px" }}
          >
            <Empty
              description={<Text type="secondary">No trucks are assigned</Text>}
            />
          </Space>
        )}
      </Card>
    </div>
  );
};

export default AssignedTrucks;
