import React from "react";
import { Input, Select } from "antd";
import { PaginationSearchFilterProps } from "../../types/common/commonTypes";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Rescheduled", label: "Rescheduled" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const capacityOptions = [
  { label: "All", value: "" },
  { label: "0 - 5000 Kg", value: "0-5000" },
  { label: "10000 - 15000 Kg", value: "10000-15000" },
  { label: "15000 - 20000 Kg", value: "15000-20000" },
  { label: "20000 - 25000 Kg", value: "20000-25000" },
];

const PaginationSearch: React.FC<PaginationSearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  capacityFilterValue,
  onCapacityFilterChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <Input.Search
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
      />
      {onFilterChange && (
        <Select
          value={filterValue}
          onChange={onFilterChange}
          options={statusOptions}
          style={{ width: 180, marginBottom: 16 }}
        />
      )}
      {onCapacityFilterChange && (
        <Select
          value={capacityFilterValue}
          onChange={onCapacityFilterChange}
          options={capacityOptions}
          style={{ width: 180, marginBottom: 16 }}
          placeholder="Filter by Capacity"
        />
      )}
    </div>
  );
};

export default PaginationSearch;
