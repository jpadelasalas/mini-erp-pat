import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import useForm from "../hooks/useForm";
import Swal from "sweetalert2";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import { createContext, useContextSelector } from "use-context-selector";
import type { Employee, FormErrors } from "../types";
import {
  bumpDocNo,
  formatDocNo,
  getDocNo,
  getLocalData,
  getUserId,
  type PerUser,
} from "../lib/storage";

const EMPTY_EMPLOYEE: Employee = {
  employeeId: "",
  last_name: "",
  first_name: "",
  position: "",
  email: "",
  status: "",
  joined_at: "",
};

const validation = (vals: Employee) => {
  const errors: FormErrors<Employee> = {};
  if (!vals.last_name) errors.last_name = "Last name is required";
  if (!vals.first_name) errors.first_name = "First name is required";
  if (!vals.position) errors.position = "Position is required";
  if (!vals.email) errors.email = "Email is required";
  if (!vals.status) errors.status = "Status is required";
  if (!vals.joined_at) errors.joined_at = "Joined At is required";

  return errors;
};

const useEmployeesState = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const rendered = useRef(false);

  const { values, handleChange, isError, handleSubmit, dispatchForm } = useForm(
    EMPTY_EMPLOYEE,
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
  } = usePaginationWithSearch<Employee>();

  // Initialize
  useEffect(() => {
    const userId = getUserId();
    if (!userId || !getDocNo(userId, "employees")) return;

    setData(getLocalData<PerUser<Employee>>("Employees")[userId] || []);
  }, [setData]);

  // Persist to localStorage
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
      return;
    }
    const userId = getUserId();
    if (!userId) return;

    const items = getLocalData<PerUser<Employee>>("Employees");
    items[userId] = employeeList;
    localStorage.setItem("Employees", JSON.stringify(items));
  }, [employeeList]);

  const handleOpenModal = useCallback(() => {
    const docNo = getDocNo(getUserId(), "employees");
    if (!docNo) return;

    setIsEditing(false);
    setTitle("Add New Employee");
    dispatchForm({ ...EMPTY_EMPLOYEE, employeeId: formatDocNo(docNo) });
    setIsOpenModal(true);
  }, [dispatchForm]);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const onEdit = useCallback(
    (item: Employee) => {
      setIsEditing(true);
      setTitle("Update Employee");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddEmployee = (vals: Employee) => {
    setData((prev) => [...prev, vals]);

    if (bumpDocNo(getUserId(), "employees")) {
      Swal.fire({ icon: "success", title: "Added Successfully!" }).then(
        (res) => {
          if (res.isConfirmed) handleCloseModal();
        }
      );
    }
  };

  const handleUpdateEmployee = (vals: Employee) => {
    setData((prev) =>
      prev.map((item) => (item.employeeId === vals.employeeId ? vals : item))
    );
    Swal.fire({ icon: "success", title: "Updated Successfully!" }).then(
      (res) => {
        if (res.isConfirmed) handleCloseModal();
      }
    );
  };

  const handleSubmitForm = (formValues: Employee) => {
    if (isEditing) handleUpdateEmployee(formValues);
    else handleAddEmployee(formValues);
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
          setData((prev) => prev.filter((item) => item.employeeId !== id));
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
      handleCloseModal,
      handleOpenModal,
      onEdit,
    }),

    [isOpenModal, isEditing, title, handleCloseModal, handleOpenModal, onEdit]
  );

  const parentData = useMemo(
    () => ({
      search,
      paginatedData,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      handleSearch,
      handlePageChange,
      handleRowsPerPageChange,
    }),
    [
      search,
      paginatedData,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      handleSearch,
      handlePageChange,
      handleRowsPerPageChange,
    ]
  );

  const formData = {
    values,
    handleChange,
    isError,
    handleSubmitForm,
    handleSubmit,
    handleDeleteItem,
  };

  return { modalData, parentData, formData };
};

type EmployeesValue = ReturnType<typeof useEmployeesState>;

const EmployeesContext = createContext<EmployeesValue | null>(null);

export const EmployeesContextProvider = ({ children }: { children: ReactNode }) => (
  <EmployeesContext.Provider value={useEmployeesState()}>
    {children}
  </EmployeesContext.Provider>
);

/* eslint-disable react-refresh/only-export-components */
export const useEmployeesModalData = () =>
  useContextSelector(EmployeesContext, (ctx) => ctx!.modalData);
export const useEmployeesParentData = () =>
  useContextSelector(EmployeesContext, (ctx) => ctx!.parentData);
export const useEmployeesFormData = () =>
  useContextSelector(EmployeesContext, (ctx) => ctx!.formData);
