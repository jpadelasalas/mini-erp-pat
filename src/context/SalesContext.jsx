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
  const qtySold = Number(vals.quantity_sold || 0);
  const totalPrice = Number(vals.total_price || 0);

  if (!vals.itemNum) errors.itemNum = "Item is required";
  if (qtySold <= 0)
    errors.quantity_sold = "Quantity Sold must be greater than 0";
  if (totalPrice <= 0)
    errors.total_price = "Total Price must be greater than 0";

  if (!vals.sold_at) errors.sold_at = "Sold At is required";

  return errors;
};

export const SalesContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemList, setItemList] = useState([]);
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
    mergeForm,
    dispatch,
  } = useForm({}, validation);

  const handleItemChange = useCallback(
    (e) => {
      mergeForm({
        quantity_sold: 0,
        total_price: 0,
      });
      handleChange(e);
    },
    [handleChange, mergeForm]
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

  const getLocalData = useCallback((key, defaultVal = {}) => {
    try {
      return JSON.parse(
        localStorage.getItem(key) || JSON.stringify(defaultVal)
      );
    } catch {
      return defaultVal;
    }
  }, []);

  const getUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      return user?.id || null;
    } catch {
      return null;
    }
  };

  const getDocNo = useCallback(
    (userId) => {
      try {
        const docnoData = getLocalData("docno");
        return docnoData?.[userId]?.sales || null;
      } catch {
        return null;
      }
    },
    [getLocalData]
  );

  //   const today = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const docNo = getDocNo(userId);
    if (!docNo) return;

    const sales = getLocalData("Sales");
    const inventory = getLocalData("Inventory");

    if (inventory) {
      const items = inventory[userId].filter((item) => item.quantity > 0);
      setItemList(items);
    }

    setData(sales[userId] || []);
  }, [setData, getLocalData, getDocNo]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = getLocalData("Sales");
    items[userId] = salesList;
    localStorage.setItem("Sales", JSON.stringify(items));
  }, [salesList, getLocalData]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId);
    const inventory = getLocalData("Inventory");

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
  }, [dispatchForm, getLocalData, getDocNo]);

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

  const onEdit = useCallback(
    (item) => {
      const userId = getUserId();
      const inventory = getLocalData("Inventory");
      const items = inventory[userId].filter((item) => item.quantity > 0);
      const selectedItem = inventory[userId].find(
        (inventoryItem) => inventoryItem.itemNum === item.itemNum
      );
      const exists = items.some(
        (inventoryItem) => inventoryItem.itemNum === selectedItem.itemNum
      );

      setItemList(
        exists
          ? items.map((inventoryItem) =>
              inventoryItem.itemNum === selectedItem.itemNum
                ? selectedItem
                : inventoryItem
            )
          : [...items, selectedItem]
      );

      setIsEditing(true);
      setTitle("Update Item");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm, getLocalData]
  );

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
    const docnoData = getLocalData("docno");
    const inventory = getLocalData("Inventory");

    inventory[userId] = inventory[userId].map((item) =>
      item.itemNum === vals.itemNum
        ? { ...item, quantity: item.quantity - vals.quantity_sold }
        : item
    );

    localStorage.setItem("Inventory", JSON.stringify(inventory));

    setData((prev) => [...prev, vals]);

    if (docnoData?.[userId]?.sales) {
      docnoData[userId].sales.docnum += 1;
      localStorage.setItem("docno", JSON.stringify(docnoData));
    }

    Swal.fire({ icon: "success", title: "Added Successfully!" }).then((res) => {
      if (res.isConfirmed) handleCloseModal();
    });
  };

  const handleUpdateSales = (vals) => {
    const userId = getUserId();
    const inventory = getLocalData("Inventory");
    const userInventory = inventory[userId] || [];

    setData((prev) => {
      const currentData = prev.find((item) => item.salesNum === vals.salesNum);
      if (!currentData) return prev;

      const quantitySold = Number(vals.quantity_sold);
      const oldQuantitySold = Number(currentData.quantity_sold);

      if (vals.itemNum === currentData.itemNum) {
        // Same item, adjust stock by the difference
        const difference = quantitySold - oldQuantitySold;
        const currentStock =
          userInventory.find((i) => i.itemNum === vals.itemNum)?.quantity ?? 0;

        if (currentStock < difference) {
          Swal.fire({
            icon: "error",
            title: "Quantity Sold is greater than Inventory Quantity",
          });
          return prev;
        }

        const updatedInventory = userInventory.map((item) =>
          item.itemNum === vals.itemNum
            ? { ...item, quantity: item.quantity - difference }
            : item
        );

        inventory[userId] = updatedInventory;
        localStorage.setItem("Inventory", JSON.stringify(inventory));
      } else {
        // Different item, restore old stock & deduct from new item
        const newItemStock =
          userInventory.find((i) => i.itemNum === vals.itemNum)?.quantity ?? 0;

        if (newItemStock < quantitySold) {
          Swal.fire({
            icon: "error",
            title: "Quantity Sold is greater than Inventory Quantity",
          });
          return prev;
        }

        const updatedInventory = userInventory.map((item) =>
          item.itemNum === currentData.itemNum
            ? { ...item, quantity: item.quantity + oldQuantitySold }
            : item.itemNum === vals.itemNum
            ? { ...item, quantity: item.quantity - quantitySold }
            : item
        );

        inventory[userId] = updatedInventory;
        localStorage.setItem("Inventory", JSON.stringify(inventory));
      }

      Swal.fire({ icon: "success", title: "Updated Successfully!" }).then(
        (res) => {
          if (res.isConfirmed) handleCloseModal();
        }
      );

      return prev.map((item) =>
        item.salesNum === vals.salesNum ? vals : item
      );
    });
  };

  const handleSubmitForm = (formValues) => {
    isEditing ? handleUpdateSales(formValues) : handleAddSales(formValues);
  };

  const handleDeleteItem = useCallback(
    (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setData((prev) => prev.filter((item) => item.salesNum !== id));
          Swal.fire({ icon: "success", title: "Deleted Successfully!" });
          setIsOpenModal(false);
        }
      });
    },
    [setData]
  );

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
        onEdit,
        handleDeleteItem,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
