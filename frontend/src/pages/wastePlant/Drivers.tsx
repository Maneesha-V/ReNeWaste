import React, { useCallback, useEffect } from "react";
import { Table, Button, Popconfirm, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  deleteDriver,
  fetchDrivers,
} from "../../redux/slices/wastePlant/wastePlantDriverSlice";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import usePagination from "../../hooks/usePagination";
import PaginationSearch from "../../components/common/PaginationSearch";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const Drivers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { driver, loading, error, total } = useSelector(
    (state: RootState) => state.wastePlantDriver
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();

  const debouncedFetchDrivers = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchDrivers({ page, limit, search: query }));
    }, 500),
    [dispatch]
  );
  useEffect(() => {
    debouncedFetchDrivers(currentPage, pageSize, search);
    return () => {
      debouncedFetchDrivers.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchDrivers]);

  const handleEdit = async (driverId: string) => {
    try {
      navigate(`/waste-plant/edit-driver/${driverId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (driverId: string) => {
    try {
      const response = await dispatch(deleteDriver(driverId)).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs paths={[{ label: "Drivers" }]} />
          <h1 className="text-xl font-bold text-gray-800">Driver Management</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/waste-plant/add-driver")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Driver
        </Button>
      </div>

      {/* Table */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto space-y-2">
          <PaginationSearch
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onSearchChange={setSearch}
            searchValue={search}
          />
          <Spin spinning={loading}>
          <Table
            dataSource={Array.isArray(driver) ? driver : []}
            rowKey="_id"
            bordered
            className="shadow-sm"
            pagination={false}
          >
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column
              title="License No"
              dataIndex="licenseNumber"
              key="licenseNumber"
            />
            <Table.Column title="Contact" dataIndex="contact" key="contact" />
            <Table.Column
              title="Experience (years)"
              dataIndex="experience"
              key="experience"
            />
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status: string) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === "Active"
                      ? "bg-green-100 text-green-800"
                      : status === "Inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {status}
                </span>
              )}
            />
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, record: any) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(record._id)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
          </Spin>
        </div>
      )}
    </div>
  );
};

export default Drivers;
