import React from "react";
import { Input, Pagination, Space } from "antd";
import { PaginationSearchProps } from "../../types/commonTypes";


const PaginationSearch: React.FC<PaginationSearchProps> = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onSearchChange,
  searchValue,
}) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Input.Search
        placeholder="Search ...."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{ width: 300 }}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </Space>
  );
};

export default PaginationSearch;
