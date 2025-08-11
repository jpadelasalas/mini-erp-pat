import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";

const InventoryContext = createContext();

const validation = (vals) => {
  const errors = {};

  if (!vals.name) {
    errors.name = "Name is required";
  }
  if (!vals.category) {
    errors.category = "Category is required";
  }
  if (vals.quantity <= 0) {
    errors.quantity = "Quantity must be greater than 0";
  }
  if (!vals.price) {
    errors.price = "Price is required";
  } else if (vals.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
};

export const InventoryContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const rendered = useRef(false);

  const {
    search,
    paginatedData,
    data: itemLists,
    currentPage,
    dataPerPage,
    totalPages,
    totalData,
    setSearch,
    handlePageChange,
    handleRowsPerPageChange,
    setData,
  } = usePaginationWithSearch();

  // Initialization of Data
  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const docNum = JSON.parse(localStorage.getItem("docno"))[userId].inventory;
    const items = JSON.parse(localStorage.getItem("Inventory")) || {};

    setInitialValues({
      itemNum:
        docNum.prefix + String(docNum.docnum).padStart(docNum.length, "0"),
      name: "",
      description: "",
      category: "",
      quantity: 1,
      price: "",
    });

    setData(items[userId] || []);
  }, [setData]);

  // Saving data in localStorage once itemLists changes
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }

    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const items = JSON.parse(localStorage.getItem("Inventory")) || {};
    items[userId] = itemLists;
    localStorage.setItem("Inventory", JSON.stringify(items));
  }, [itemLists]);

  const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
    initialValues,
    validation
  );

  const handleOpenModal = useCallback(() => {
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const docNum = JSON.parse(localStorage.getItem("docno"))[userId].inventory;
    const item = {
      itemNum:
        docNum.prefix + String(docNum.docnum).padStart(docNum.length, "0"),
      name: "",
      description: "",
      category: "",
      quantity: 1,
      price: "",
    };

    setInitialValues(item);
    setIsEditing(false);
    setTitle("Add New Inventory");
    dispatchForm(item);
    setIsOpenModal(true);
  }, [dispatchForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
    dispatchForm();
  }, [dispatchForm]);

  const onEdit = useCallback(
    (id) => {
      const item = itemLists.find((item) => item.itemNum === id);

      setIsEditing(true);
      setTitle("Update Item");
      setInitialValues(item);
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [itemLists, dispatchForm]
  );

  const handleAddNewInventory = (vals) => {
    setData((prev) => [
      ...prev,
      {
        ...vals,
        date_created: new Date().toLocaleDateString(),
        updated_at: new Date().toLocaleDateString(),
      },
    ]);

    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const docno = JSON.parse(localStorage.getItem("docno"));
    docno[userId].inventory.docnum += 1;
    localStorage.setItem("docno", JSON.stringify(docno));
    Swal.fire({
      icon: "success",
      title: "Added Successfully!",
    }).then((alert) => {
      if (alert.isConfirmed) handleCloseModal();
    });
  };

  const handleUpdateInventory = (vals) => {
    setData((prev) =>
      prev.map((item) =>
        item.itemNum === vals.itemNum
          ? { ...vals, updated_at: new Date().toLocaleDateString() }
          : item
      )
    );
    Swal.fire({
      icon: "success",
      title: "Updated Successfully!",
    }).then((alert) => {
      if (alert.isConfirmed) handleCloseModal();
    });
  };

  const handleSubmitForm = (values) => {
    if (isEditing) {
      handleUpdateInventory(values);
    } else {
      handleAddNewInventory(values);
    }
  };

  const handleDeleteItem = (id) => {
    setData((prev) => prev.filter((item) => item.itemNum !== id));
    Swal.fire({
      icon: "success",
      title: "Deleted Successfully!",
    }).then((alert) => {
      if (alert.isConfirmed) handleCloseModal();
    });
  };

  return (
    <InventoryContext.Provider
      value={{
        search,
        setSearch,
        isOpenModal,
        setIsOpenModal,
        handleOpenModal,
        handleCloseModal,
        values,
        handleChange,
        isError,
        onEdit,
        handleSubmit,
        handleSubmitForm,
        handleDeleteItem,
        dispatchForm,
        title,
        currentPage,
        dataPerPage,
        totalPages,
        totalData,
        handlePageChange,
        handleRowsPerPageChange,
        paginatedData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
