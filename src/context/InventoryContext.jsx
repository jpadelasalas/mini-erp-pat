import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";

const InventoryContext = createContext();

const validation = (vals) => {
  const errors = {};

  if (!vals.name) errors.name = "Name is required";
  if (!vals.category) errors.category = "Category is required";
  if (vals.quantity <= -1) errors.quantity = "Quantity must be greater than -1";

  if (!vals.price) {
    errors.price = "Price is required";
  } else if (vals.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
};

export const InventoryContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const rendered = useRef(false);

  const {
    search,
    paginatedData,
    data: inventoryList,
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
    {},
    validation
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
      return docnoData?.[userId]?.inventory || null;
    } catch {
      return null;
    }
  };

  const today = () => new Date().toISOString().split("T")[0];

  // Initialize
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const docNo = getDocNo(userId);
    if (!docNo) return;

    const items = JSON.parse(localStorage.getItem("Inventory") || "{}");

    setData(items[userId] || []);
  }, [setData]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = JSON.parse(localStorage.getItem("Inventory") || "{}");
    items[userId] = inventoryList;
    localStorage.setItem("Inventory", JSON.stringify(items));
  }, [inventoryList]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId);
    if (!docNo) return;

    const newItem = {
      itemNum: docNo.prefix + String(docNo.docnum).padStart(docNo.length, "0"),
      name: "",
      description: "",
      category: "",
      quantity: 1,
      price: "",
    };

    setIsEditing(false);
    setTitle("Add New Inventory");
    dispatchForm(newItem);
    setIsOpenModal(true);
  }, [dispatchForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onEdit = useCallback(
    (item) => {
      setIsEditing(true);
      setTitle("Update Item");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddInventory = (vals) => {
    setData((prev) => [
      ...prev,
      {
        ...vals,
        date_created: today(),
        updated_at: today(),
      },
    ]);

    const userId = getUserId();
    const docnoData = JSON.parse(localStorage.getItem("docno") || "{}");
    if (docnoData?.[userId]?.inventory) {
      docnoData[userId].inventory.docnum += 1;
      localStorage.setItem("docno", JSON.stringify(docnoData));
      Swal.fire({ icon: "success", title: "Added Successfully!" }).then(
        (res) => {
          if (res.isConfirmed) handleCloseModal();
        }
      );
    }
  };

  const handleUpdateInventory = (vals) => {
    setData((prev) =>
      prev.map((item) =>
        item.itemNum === vals.itemNum ? { ...vals, updated_at: today() } : item
      )
    );
    Swal.fire({ icon: "success", title: "Updated Successfully!" }).then(
      (res) => {
        if (res.isConfirmed) handleCloseModal();
      }
    );
  };

  const handleSubmitForm = (formValues) => {
    isEditing
      ? handleUpdateInventory(formValues)
      : handleAddInventory(formValues);
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
          setData((prev) => prev.filter((item) => item.itemNum !== id));
          Swal.fire({ icon: "success", title: "Deleted Successfully!" });
          setIsOpenModal(false);
        }
      });
    },
    [setData]
  );

  const modalData = useMemo(
    () => ({
      isOpenModal,
      handleOpenModal,
      handleCloseModal,
      title,
      onEdit,
    }),
    [isOpenModal, handleOpenModal, handleCloseModal, title, onEdit]
  );

  const parentData = useMemo(
    () => ({
      search,
      handleSearch,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      paginatedData,
    }),
    [
      search,
      handleSearch,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      paginatedData,
    ]
  );

  const formData = useMemo(
    () => ({
      values,
      handleChange,
      isError,
      handleSubmit,
      handleSubmitForm,
      handleDeleteItem,
    }),
    [
      values,
      handleChange,
      isError,
      handleSubmit,
      handleSubmitForm,
      handleDeleteItem,
    ]
  );

  const value = useMemo(
    () => ({
      modalData,
      formData,
      parentData,
    }),
    [modalData, formData, parentData]
  );
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryModalData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx?.modalData);
export const useInventoryFormData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx?.formData);
export const useInventoryParentData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx?.parentData);
