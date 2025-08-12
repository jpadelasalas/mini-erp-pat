import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import useForm from "../hooks/useForm";

const SalesContext = createContext();

export const SalesContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
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

  const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
    initialValues
    // validation
  );

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

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const docNo = getDocNo(userId);
    if (!docNo) return;

    const items = JSON.parse(localStorage.getItem("Inventory") || "{}");

    setData(items[userId] || []);
  }, [setData]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId);
    if (!docNo) return;

    const newItem = {
      salesNum: docNo.prefix + String(docNo.docnum).padStart(docNo.length, "0"),
      itemNum: "",
      quantity_sold: "",
      total_price: "",
      sold_at: 1,
      customer_name: "",
    };

    setIsEditing(false);
    setTitle("Add New Sales");
    dispatchForm(newItem);
    setIsOpenModal(true);
  }, [dispatchForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return (
    <SalesContext.Provider
      value={{
        isOpenModal,
        title,
        search,
        handleSearch,
        handleOpenModal,
        handleCloseModal,
        values,
        handleChange,
        isError,
        handleSubmit,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
