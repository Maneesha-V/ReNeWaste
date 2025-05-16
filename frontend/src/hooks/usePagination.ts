import { useState } from "react";

const usePagination = (initialPage = 1, initialPageSize = 5) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    resetPage(); // reset to page 1 on search
  };

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    search,
    setSearch: handleSearchChange,
    resetPage,
  };
};

export default usePagination;
