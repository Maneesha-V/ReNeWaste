import React, { useCallback, useEffect } from "react";
import { Table, Button, Space, Typography, Popconfirm, Pagination } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteDropSpot,
  fetchDropSpotById,
  fetchDropSpots,
  updateDelDropSpot,
} from "../../redux/slices/wastePlant/wastePlantDropSpotSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PaginationSearch from "../../components/common/PaginationSearch";
import usePagination from "../../hooks/usePagination";
import { debounce } from "lodash";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { DropSpotDTO } from "../../types/dropspots/dropSpotTypes";

const { Title } = Typography;

const DropSpots: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { dropSpots, total } = useSelector(
    (state: RootState) => state.wastePlantDropSpot
  );
  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();

  const debouncedFetchDropSpots = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchDropSpots({ page, limit, search: query }));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchDropSpots(currentPage, pageSize, search);

    return () => {
      debouncedFetchDropSpots.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchDropSpots]);


  const handleDelete = async (id: string) => {
    try {
      const res = await dispatch(deleteDropSpot(id)).unwrap();
      toast.success(res?.message);
      dispatch(updateDelDropSpot(res.dropspot._id))
      // dispatch(fetchDropSpots({ page: currentPage, limit: pageSize, search }));
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const columns = [
    {
      title: "Drop Spot Name",
      dataIndex: "dropSpotName",
      key: "dropSpotName",
    },
    {
      title: "Address",
      key: "address",
      render: (record: DropSpotDTO) =>
        `${record.addressLine}, ${record.location}`,
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: DropSpotDTO) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = async (record: DropSpotDTO) => {
    console.log("Edit record:", record);
    try {
      await dispatch(fetchDropSpotById(record._id)).unwrap();
      navigate(`/waste-plant/edit-drop-spot/${record._id}`);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };
  const handleCreate = () => {
    console.log("Create button clicked");
    navigate("/waste-plant/add-drop-spot");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Available Dropspots
        </Title>
        <Button type="primary" onClick={handleCreate}>
          Create Drop Spot
        </Button>
      </div>
      <PaginationSearch onSearchChange={setSearch} searchValue={search} />
      <Table
        rowKey="_id"
        dataSource={dropSpots}
        columns={columns}
        pagination={false}
      />
      <div className="flex justify-end pt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default DropSpots;
