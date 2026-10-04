import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import type { FormErrors, InventoryItem } from "../types";
import {
  bumpDocNo,
  formatDocNo,
  getDocNo,
  getLocalData,
  getUserId,
  type PerUser,
} from "../lib/storage";

const EMPTY_ITEM: InventoryItem = {
  itemNum: "",
  name: "",
  description: "",
  category: "",
  quantity: 1,
  price: "",
};

const validation = (vals: InventoryItem) => {
  const errors: FormErrors<InventoryItem> = {};

  if (!vals.name) errors.name = "Name is required";
  if (!vals.category) errors.category = "Category is required";
  if (Number(vals.quantity) <= -1)
    errors.quantity = "Quantity must be greater than -1";

  if (!vals.price) {
    errors.price = "Price is required";
  } else if (Number(vals.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
};

const today = () => new Date().toISOString().split("T")[0];

const useInventoryState = () => {
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
    totalData,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    setData,
  } = usePaginationWithSearch<InventoryItem>();

  const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
    EMPTY_ITEM,
    validation
  );

  // Initialize
  useEffect(() => {
    const userId = getUserId();
    if (!userId || !getDocNo(userId, "inventory")) return;

    setData(getLocalData<PerUser<InventoryItem>>("Inventory")[userId] || []);
  }, [setData]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = getLocalData<PerUser<InventoryItem>>("Inventory");
    items[userId] = inventoryList;
    localStorage.setItem("Inventory", JSON.stringify(items));
  }, [inventoryList]);

  const handleOpenModal = useCallback(() => {
    const docNo = getDocNo(getUserId(), "inventory");
    if (!docNo) return;

    setIsEditing(false);
    setTitle("Add New Inventory");
    dispatchForm({ ...EMPTY_ITEM, itemNum: formatDocNo(docNo) });
    setIsOpenModal(true);
  }, [dispatchForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onEdit = useCallback(
    (item: InventoryItem) => {
      setIsEditing(true);
      setTitle("Update Item");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddInventory = (vals: InventoryItem) => {
    setData((prev) => [
      ...prev,
      {
        ...vals,
        date_created: today(),
        updated_at: today(),
      },
    ]);

    if (bumpDocNo(getUserId(), "inventory")) {
      Swal.fire({ icon: "success", title: "Added Successfully!" }).then(
        (res) => {
          if (res.isConfirmed) handleCloseModal();
        }
      );
    }
  };

  const handleUpdateInventory = (vals: InventoryItem) => {
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

  const handleSubmitForm = (formValues: InventoryItem) => {
    if (isEditing) handleUpdateInventory(formValues);
    else handleAddInventory(formValues);
  };

  const handleDeleteItem = useCallback(
    (id: string) => {
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
      isEditing,
      handleOpenModal,
      handleCloseModal,
      title,
      onEdit,
    }),
    [isOpenModal, isEditing, handleOpenModal, handleCloseModal, title, onEdit]
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

  const formData = {
    values,
    handleChange,
    isError,
    handleSubmit,
    handleSubmitForm,
    handleDeleteItem,
  };

  return { modalData, formData, parentData };
};

type InventoryValue = ReturnType<typeof useInventoryState>;

const InventoryContext = createContext<InventoryValue | null>(null);

export const InventoryContextProvider = ({ children }: { children: ReactNode }) => (
  <InventoryContext.Provider value={useInventoryState()}>
    {children}
  </InventoryContext.Provider>
);

/* eslint-disable react-refresh/only-export-components */
export const useInventoryModalData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx!.modalData);
export const useInventoryFormData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx!.formData);
export const useInventoryParentData = () =>
  useContextSelector(InventoryContext, (ctx) => ctx!.parentData);
