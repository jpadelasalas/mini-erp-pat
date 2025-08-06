import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useDebounce from "../hooks/useDebounce";
import useForm from "../hooks/useForm";

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
  if (vals.price <= 0) {
    errors.price = "Price must be greater than 0";
  }
  return errors;
};

export const InventoryContextProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("user")).id;
    const docNum = JSON.parse(localStorage.getItem("docno"))[userId].inventory;
    setInitialValues({
      itemNum:
        docNum.prefix + String(docNum.docnum).padStart(docNum.length, "0"),
      name: "",
      description: "",
      category: "",
      quantity: 1,
      price: "",
    });
  }, [setInitialValues]);

  const { values, handleChange, isError, handleSubmit, resetForm } = useForm(
    initialValues,
    validation
  );

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
    resetForm();
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (debouncedSearch.trim() != "") {
      console.log(debouncedSearch);
    }
  }, [debouncedSearch]);

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
        handleSubmit,
        resetForm,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
