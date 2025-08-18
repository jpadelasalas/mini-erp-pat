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

const EmployeesContext = createContext();

const validation = (vals) => {
  let errors = {};
  if (!vals.last_name) errors.last_name = "Last name is required";
  if (!vals.first_name) errors.first_name = "First name is required";
  if (!vals.position) errors.position = "Position is required";
  if (!vals.email) errors.email = "Email is required";
  if (!vals.status) errors.status = "Status is required";
  if (!vals.joined_at) errors.joined_at = "Joined At is required";

  return errors;
};

export const EmployeesContextProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const rendered = useRef(false);

  const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
    {},
    validation
  );

  const {
    search,
    paginatedData,
    data: employeeList,
    totalPages,
    totalData,
    currentPage,
    dataPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    setData,
  } = usePaginationWithSearch();

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
        return docnoData?.[userId]?.employees || null;
      } catch {
        return null;
      }
    },
    [getLocalData]
  );

  // Initialize
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const docNo = getDocNo(userId);
    if (!docNo) return;

    const items = getLocalData("Employees");

    setData(items[userId] || []);
  }, [setData, getLocalData, getDocNo]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = getLocalData("Employees");
    items[userId] = employeeList;
    localStorage.setItem("Employees", JSON.stringify(items));
  }, [employeeList, getLocalData]);

  const handleOpenModal = useCallback(() => {
    const userId = getUserId();
    const docNo = getDocNo(userId);
    if (!docNo) return;

    const newItem = {
      employeeId:
        docNo.prefix + String(docNo.docnum).padStart(docNo.length, "0"),
      last_name: "",
      first_name: "",
      position: "",
      email: "",
      status: "",
      joined_at: "",
    };

    setIsEditing(false);
    setTitle("Add New Employee");
    dispatchForm(newItem);
    setIsOpenModal(true);
  }, [dispatchForm, getDocNo]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onEdit = useCallback(
    (item) => {
      setIsEditing(true);
      setTitle("Update Employee");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddInventory = (vals) => {
    setData((prev) => [...prev, vals]);

    const userId = getUserId();
    const docnoData = JSON.parse(localStorage.getItem("docno") || "{}");
    if (docnoData?.[userId]?.employees) {
      docnoData[userId].employees.docnum += 1;
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
      prev.map((item) => (item.itemNum === vals.itemNum ? vals : item))
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
          setData((prev) => prev.filter((item) => item.employeeId !== id));
          Swal.fire({ icon: "success", title: "Deleted Successfully!" });
          setIsOpenModal(false);
        }
      });
    },
    [setData]
  );

  return (
    <EmployeesContext.Provider
      value={{
        search,
        paginatedData,
        currentPage,
        dataPerPage,
        totalPages,
        totalData,
        handleSearch,
        handlePageChange,
        handleRowsPerPageChange,
        isOpenModal,
        title,
        handleCloseModal,
        values,
        handleChange,
        isError,
        handleSubmitForm,
        handleSubmit,
        handleOpenModal,
        onEdit,
        handleDeleteItem,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeesContext);
