import React, { useCallback, useEffect } from "react";
import { Table, Button, Space, Typography, Popconfirm, Tag } from "antd";
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

const { Title } = Typography;

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total } = useSelector(
    (state: RootState) => state.wastePlantUser
  );

  const { currentPage, setCurrentPage, pageSize, search, setSearch } = usePagination();

  const debouncedFetchUsers = useCallback(
    debounce((page: number, limit: number, query: string) => {
      dispatch(fetchUsers({ page, limit, search: query }));
    }, 500),
    [dispatch]
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
        toggleUserBlockStatus({ userId, isBlocked: !isBlocked })
      ).unwrap();
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      dispatch(fetchUsers({ page: currentPage, limit: pageSize, search }));
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
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
      title: "Status",
      key: "status",
      render: (_: any, record: any) =>
        record.isBlocked ? (
          <Tag color="red">Blocked</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title={`Are you sure you want to ${
              record.isBlocked ? "unblock" : "block"
            } this user?`}
            onConfirm={() => handleToggleBlock(record._id, record.isBlocked)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type={record.isBlocked ? "default" : "primary"}
              danger={record.isBlocked}
            >
              {record.isBlocked ? "Unblock" : "Block"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        User Management
      </Title>

      <PaginationSearch
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onSearchChange={setSearch}
        searchValue={search}
      />

      <Table
        rowKey="_id"
        dataSource={users}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default Users;
