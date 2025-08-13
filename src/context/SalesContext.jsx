import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";

const SalesContext = createContext();

const validation = (vals) => {
  const errors = {};

  if (!vals.itemNum) errors.itemNum = "Item is required";
  if (vals.quantity_sold <= 0)
    errors.quantity_sold = "Quantity Sold must be greater than 0";
  if (vals.total_price <= 0)
    errors.total_price = "Total Price must be greater than 0";
  if (!vals.sold_at) errors.sold_at = "Sold At is required";

  return errors;
};

export const SalesContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemList, setItemList] = useState({});
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
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    setData,
  } = usePaginationWithSearch();

  const {
    values,
    handleChange,
    isError,
    handleSubmit,
    dispatchForm,
    dispatch,
  } = useForm({}, validation);

  const handleItemChange = useCallback(
    (e) => {
      dispatchForm({
        ...values,
        quantity_sold: 0,
        total_price: 0,
      });
      handleChange(e);
    },
    [handleChange, dispatchForm, values]
  );

  const handleQuantitySoldChange = useCallback(
    (e) => {
      if (values.itemNum) {
        handleChange(e);
        const itemPrice = itemList.find(
          (item) => item.itemNum === values.itemNum
        );
        dispatch({
          type: "ADD_INPUT",
          name: "total_price",
          value: e.target.value * itemPrice.price,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Please select an item first",
        });
      }
    },
    [handleChange, dispatch, itemList, values.itemNum]
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

    const sales = JSON.parse(localStorage.getItem("Sales") || "{}");

    setData(sales[userId] || []);
  }, [setData]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = JSON.parse(localStorage.getItem("Sales") || "{}");
    items[userId] = salesList;
    localStorage.setItem("Sales", JSON.stringify(items));
  }, [salesList]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId);
    const inventory = JSON.parse(localStorage.getItem("Inventory") || "{}");

    if (!docNo) return;

    const newItem = {
      salesNum: docNo.prefix + String(docNo.docnum).padStart(docNo.length, "0"),
      itemNum: "",
      quantity_sold: "0",
      total_price: "0",
      sold_at: "",
      customer_name: "",
    };

    if (inventory) {
      const items = inventory[userId].filter((item) => item.quantity > 0);
      setItemList(items);
    }

    setIsEditing(false);
    setTitle("Add New Sales");
    dispatchForm(newItem);
    setIsOpenModal(true);
  }, [dispatchForm]);

  const memoizedItems = useMemo(() => {
    return itemList.length ? (
      itemList.map((item, index) => (
        <option key={index} value={item.itemNum}>
          {item.name}
        </option>
      ))
    ) : (
      <option value=""></option>
    );
  }, [itemList]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleUpdateInventory = (vals, userId) => {
    const fetchItems = JSON.parse(localStorage.getItem("Inventory") || "{}");
    const inventory = { ...fetchItems };

    const updated = inventory[userId].find(
      (item) => item.itemNum === vals.itemNum
    );

    updated.quantity -= vals.quantity_sold;
    inventory[userId] = inventory[userId].map((items) =>
      items.itemNum === vals.itemNum ? updated : items
    );

    localStorage.setItem("Inventory", JSON.stringify(inventory));
    return;
  };

  const handleAddSales = (vals) => {
    const quantity = itemList.find(
      (item) => item.itemNum === vals.itemNum
    ).quantity;

    if (quantity < vals.quantity_sold) {
      Swal.fire({
        icon: "error",
        title: "Quantity Sold is greater than Inventory Quantity",
      });
      return;
    }
    const userId = getUserId();
    const docnoData = JSON.parse(localStorage.getItem("docno") || "{}");
    handleUpdateInventory(vals, userId);

    setData((prev) => [...prev, vals]);

    if (docnoData?.[userId]?.sales) {
      docnoData[userId].sales.docnum += 1;
      localStorage.setItem("docno", JSON.stringify(docnoData));
    }

    Swal.fire({ icon: "success", title: "Added Successfully!" }).then((res) => {
      if (res.isConfirmed) handleCloseModal();
    });
  };

  const handleUpdateSales = (vals) => {};

  const handleSubmitForm = (formValues) => {
    isEditing ? handleUpdateSales(formValues) : handleAddSales(formValues);
  };

  return (
    <SalesContext.Provider
      value={{
        paginatedData,
        isOpenModal,
        memoizedItems,
        title,
        search,
        handleSearch,
        handleOpenModal,
        handleCloseModal,
        values,
        handleChange,
        handleItemChange,
        handleQuantitySoldChange,
        isError,
        handleSubmit,
        handleSubmitForm,
        currentPage,
        dataPerPage,
        totalPages,
        totalData,
        handlePageChange,
        handleRowsPerPageChange,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
