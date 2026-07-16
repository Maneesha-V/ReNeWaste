import React, { useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Tag,
  Pagination,
} from "antd";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import {
  fetchUsers,
  toggleUserBlockStatus,
} from "../../redux/slices/wastePlant/wastePlantUserSlice";
import usePagination from "../../hooks/usePagination";
import PaginationSearch from "../../components/common/PaginationSearch";
import { debounce } from "lodash";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { UserResp } from "../../types/user/userTypes";

const { Title } = Typography;

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total } = useSelector(
    (state: RootState) => state.wastePlantUser,
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } =
    usePagination();
  console.log("users", users);

  const debouncedFetchUsers = useMemo(
    () =>
      debounce((page: number, limit: number, query: string) => {
        dispatch(fetchUsers({ page, limit, search: query }));
      }, 500),
    [dispatch],
  );
  useEffect(() => {
    debouncedFetchUsers(currentPage, pageSize, search);

    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [currentPage, pageSize, search, debouncedFetchUsers]);

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      await dispatch(
        toggleUserBlockStatus({ userId, isBlocked: !isBlocked }),
      ).unwrap();
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      // dispatch(fetchUsers({ page: currentPage, limit: pageSize, search }));
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      render(value: string, record: UserResp) {
        console.log("value", value);
        // console.log("record",record);
        return `${record.firstName} ${record.lastName}`;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Location",
      key: "location",
      render: (_: unknown, record: UserResp) => {
        return record.addresses[0].location || "N/A";
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "isBlocked",
      render: (value: boolean) =>
        value ? (
          <Tag color="red">Blocked</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "isBlocked",
      render: (value: boolean, record: UserResp) => (
        <Space>
          <Popconfirm
            title={`Are you sure you want to ${
              value ? "unblock" : "block"
            } this user?`}
            onConfirm={() => handleToggleBlock(record._id, value)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={value ? "default" : "primary"} danger={value}>
              {value ? "Unblock" : "Block"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Title level={3} style={{ marginBottom: 16 }}>
        User Management
      </Title>
      <div className="overflow-x-auto space-y-2">
        <PaginationSearch onSearchChange={setSearch} searchValue={search} />

        <Table
          rowKey="_id"
          dataSource={users}
          columns={columns}
          bordered
          className="shadow-sm"
          pagination={false}
        />
      </div>
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

export default Users;
