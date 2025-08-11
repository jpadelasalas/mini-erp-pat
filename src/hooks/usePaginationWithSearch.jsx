import { useCallback, useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const usePaginationWithSearch = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(10);

  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setDataPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  const filteredData = useMemo(() => {
    if (debouncedSearch.trim() === "") return data;
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    );
  }, [data, debouncedSearch]);

  const paginatedData = useMemo(() => {
    const start = currentPage * dataPerPage;
    return filteredData.slice(start, start + dataPerPage);
  }, [filteredData, currentPage, dataPerPage]);

  const totalData = filteredData.length;

  const totalPages = useMemo(() => {
    return Math.ceil(totalData / dataPerPage);
  }, [totalData, dataPerPage]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  }, []);

  return {
    search,
    data,
    paginatedData,
    currentPage,
    dataPerPage,
    totalPages,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    setData,
    handleSearch,
  };
};

export default usePaginationWithSearch;
