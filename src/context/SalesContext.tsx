import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";
import type { FormErrors, InventoryItem, Sale } from "../types";
import {
  bumpDocNo,
  formatDocNo,
  getDocNo,
  getLocalData,
  getUserId,
  type PerUser,
} from "../lib/storage";

const EMPTY_SALE: Sale = {
  salesNum: "",
  itemNum: "",
  quantity_sold: "0",
  total_price: "0",
  sold_at: "",
  customer_name: "",
};

const validation = (vals: Sale) => {
  const errors: FormErrors<Sale> = {};
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

const getInventory = () => getLocalData<PerUser<InventoryItem>>("Inventory");
const inStock = (items: InventoryItem[] = []) =>
  items.filter((item) => Number(item.quantity) > 0);
const tooManyAlert = () =>
  Swal.fire({
    icon: "error",
    title: "Quantity Sold is greater than Inventory Quantity",
  });

const useSalesState = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemList, setItemList] = useState<InventoryItem[]>([]);
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
  } = usePaginationWithSearch<Sale>();

  const {
    values,
    handleChange,
    isError,
    handleSubmit,
    dispatchForm,
    mergeForm,
    dispatch,
  } = useForm(EMPTY_SALE, validation);

  const handleItemChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      mergeForm({
        quantity_sold: 0,
        total_price: 0,
      });
      handleChange(e);
    },
    [handleChange, mergeForm]
  );

  const handleQuantitySoldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (values.itemNum) {
        handleChange(e);
        const item = itemList.find((item) => item.itemNum === values.itemNum);
        dispatch({
          type: "ADD_INPUT",
          name: "total_price",
          value: Number(e.target.value) * Number(item?.price ?? 0),
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

  useEffect(() => {
    const userId = getUserId();
    if (!userId || !getDocNo(userId, "sales")) return;

    setItemList(inStock(getInventory()[userId]));
    setData(getLocalData<PerUser<Sale>>("Sales")[userId] || []);
  }, [setData]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = getLocalData<PerUser<Sale>>("Sales");
    items[userId] = salesList;
    localStorage.setItem("Sales", JSON.stringify(items));
  }, [salesList]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId, "sales");
    if (!userId || !docNo) return;

    setItemList(inStock(getInventory()[userId]));
    setIsEditing(false);
    setTitle("Add New Sales");
    dispatchForm({ ...EMPTY_SALE, salesNum: formatDocNo(docNo) });
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

  const onEdit = useCallback(
    (sale: Sale) => {
      const userId = getUserId();
      const all = (userId && getInventory()[userId]) || [];
      const items = inStock(all);
      const selectedItem = all.find((i) => i.itemNum === sale.itemNum);

      // keep the sold item selectable even when it is now out of stock
      setItemList(
        !selectedItem || items.some((i) => i.itemNum === selectedItem.itemNum)
          ? items
          : [...items, selectedItem]
      );

      setIsEditing(true);
      setTitle("Update Item");
      dispatchForm(sale);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddSales = useCallback(
    (vals: Sale) => {
      const quantity = itemList.find(
        (item) => item.itemNum === vals.itemNum
      )?.quantity;

      if (Number(quantity ?? 0) < Number(vals.quantity_sold)) {
        tooManyAlert();
        return;
      }
      const userId = getUserId();
      if (!userId) return;
      const inventory = getInventory();

      inventory[userId] = (inventory[userId] ?? []).map((item) =>
        item.itemNum === vals.itemNum
          ? { ...item, quantity: Number(item.quantity) - Number(vals.quantity_sold) }
          : item
      );

      localStorage.setItem("Inventory", JSON.stringify(inventory));

      setData((prev) => [...prev, vals]);
      bumpDocNo(userId, "sales");

      Swal.fire({ icon: "success", title: "Added Successfully!" }).then(
        (res) => {
          if (res.isConfirmed) handleCloseModal();
        }
      );
    },
    [itemList, setData, handleCloseModal]
  );

  const handleUpdateSales = useCallback(
    (vals: Sale) => {
      const userId = getUserId();
      if (!userId) return;
      const inventory = getInventory();
      const userInventory = inventory[userId] || [];
      const stockOf = (itemNum: string) =>
        Number(userInventory.find((i) => i.itemNum === itemNum)?.quantity ?? 0);

      setData((prev) => {
        const currentData = prev.find(
          (item) => item.salesNum === vals.salesNum
        );
        if (!currentData) return prev;

        const quantitySold = Number(vals.quantity_sold);
        const oldQuantitySold = Number(currentData.quantity_sold);

        if (vals.itemNum === currentData.itemNum) {
          // Same item, adjust stock by the difference
          const difference = quantitySold - oldQuantitySold;

          if (stockOf(vals.itemNum) < difference) {
            tooManyAlert();
            return prev;
          }

          inventory[userId] = userInventory.map((item) =>
            item.itemNum === vals.itemNum
              ? { ...item, quantity: Number(item.quantity) - difference }
              : item
          );
        } else {
          // Different item, restore old stock & deduct from new item
          if (stockOf(vals.itemNum) < quantitySold) {
            tooManyAlert();
            return prev;
          }

          inventory[userId] = userInventory.map((item) =>
            item.itemNum === currentData.itemNum
              ? { ...item, quantity: Number(item.quantity) + oldQuantitySold }
              : item.itemNum === vals.itemNum
              ? { ...item, quantity: Number(item.quantity) - quantitySold }
              : item
          );
        }
        localStorage.setItem("Inventory", JSON.stringify(inventory));

        Swal.fire({ icon: "success", title: "Updated Successfully!" }).then(
          (res) => {
            if (res.isConfirmed) handleCloseModal();
          }
        );

        return prev.map((item) =>
          item.salesNum === vals.salesNum ? vals : item
        );
      });
    },
    [handleCloseModal, setData]
  );

  const handleSubmitForm = useCallback(
    (formValues: Sale) => {
      if (isEditing) handleUpdateSales(formValues);
      else handleAddSales(formValues);
    },
    [isEditing, handleUpdateSales, handleAddSales]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
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

  const modalData = useMemo(
    () => ({
      isOpenModal,
      isEditing,
      title,
      handleOpenModal,
      handleCloseModal,
      onEdit,
    }),
    [isOpenModal, isEditing, title, handleOpenModal, handleCloseModal, onEdit]
  );

  const parentData = useMemo(
    () => ({
      paginatedData,
      search,
      handleSearch,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
    }),
    [
      paginatedData,
      search,
      handleSearch,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
    ]
  );

  const formData = useMemo(
    () => ({
      memoizedItems,
      values,
      handleChange,
      handleItemChange,
      handleQuantitySoldChange,
      isError,
      handleSubmit,
      handleSubmitForm,
      handleDeleteItem,
    }),
    [
      memoizedItems,
      values,
      handleChange,
      handleItemChange,
      handleQuantitySoldChange,
      isError,
      handleSubmit,
      handleSubmitForm,
      handleDeleteItem,
    ]
  );

  return useMemo(
    () => ({ modalData, parentData, formData }),
    [modalData, parentData, formData]
  );
};

type SalesValue = ReturnType<typeof useSalesState>;

const SalesContext = createContext<SalesValue | null>(null);

export const SalesContextProvider = ({ children }: { children: ReactNode }) => (
  <SalesContext.Provider value={useSalesState()}>{children}</SalesContext.Provider>
);

/* eslint-disable react-refresh/only-export-components */
export const useSalesModalData = () =>
  useContextSelector(SalesContext, (ctx) => ctx!.modalData);
export const useSalesParentData = () =>
  useContextSelector(SalesContext, (ctx) => ctx!.parentData);
export const useSalesFormData = () =>
  useContextSelector(SalesContext, (ctx) => ctx!.formData);
