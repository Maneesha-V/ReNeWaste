import { useState } from "react";

const usePagination = (initialPage = 1, initialPageSize = 5, initialStatus = "All", initialCapacity = "") => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [capacityFilter, setCapacityFilter] = useState(initialCapacity);

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    resetPage();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    resetPage(); 
  };

  const handleCapacityChange = (capacity: string) => {
    setCapacityFilter(capacity);
    resetPage();
  };

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    search,
    setSearch: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    capacityFilter,
    setCapacityFilter: handleCapacityChange,
    resetPage,
  };
};

export default usePagination;
