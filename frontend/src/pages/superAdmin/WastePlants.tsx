import React, { useEffect } from "react";
import { Table, Button, Popconfirm, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { deleteWastePlant, fetchWastePlants } from "../../redux/slices/superAdmin/superAdminWastePlantSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Breadcrumbs from "../../components/common/Breadcrumbs";


const WastePlants: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wastePlant, loading, error } = useSelector((state: RootState) => state.superAdminWastePlant);
 
  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      navigate("/super-admin/");
      return;
    }
    dispatch(fetchWastePlants());
  }, [dispatch, navigate]);

  const handleEdit = async (id: string) => {
    try {
      navigate(`/super-admin/edit-waste-plant/${id}`)
    } catch(error: any){
      console.error(error);
    }
  }
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteWastePlant(id)).unwrap();
      await dispatch(fetchWastePlants());
    } catch (error: any) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <Breadcrumbs
            paths={[
              { label: "Waste Plants" },
            ]}
          />
          <h1 className="text-xl font-bold text-gray-800">Waste Plants Management</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/super-admin/add-waste-plant")}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Waste Plant
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <Table
            dataSource={Array.isArray(wastePlant) ? wastePlant : []}
            rowKey="_id"
            bordered
            className="shadow-sm"
            pagination={{ pageSize: 10 }}
          >
            <Table.Column title="Name" dataIndex="plantName" key="plantName" />
            <Table.Column title="Location" dataIndex="location" key="location" />
            <Table.Column title="Capacity" dataIndex="capacity" key="capacity" />
            <Table.Column title="Contact" dataIndex="contactNo" key="contactNo" />
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
                    <Button 
                    icon={<DeleteOutlined />} 
                    size="small" 
                    danger
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      )}
    </div>
  );
};

export default WastePlants;
