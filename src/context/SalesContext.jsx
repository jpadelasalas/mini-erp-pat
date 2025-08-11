import { createContext, useContext, useRef, useState } from "react";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";

const SalesContext = createContext();

export const SalesContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const rendered = useRef(false);

  const {
    search,
    paginatedData,
    data: salesList,
    currentPage,
    dataPerPage,
    totalPages,
    totalData,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    setData,
  } = usePaginationWithSearch();

  //   const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
  //     initialValues,
  //     validation
  //   );

  const getUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      return user?.id || null;
    } catch {
      return null;
    }
  };

  const getDocNo = (userId) => {
    try {
      const docnoData = JSON.parse(localStorage.getItem("docno") || "{}");
      return docnoData?.[userId]?.sales || null;
    } catch {
      return null;
    }
  };

  const today = () => new Date().toISOString().split("T")[0];

  return (
    <SalesContext.Provider value={{ isOpenModal }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
