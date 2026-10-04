import { EmployeesContextProvider } from "../context/EmployeesContext";
import EmployeesComponent from "../features/Employees/EmployeesComponent";

const Employees = () => {
  return (
    <EmployeesContextProvider>
      <EmployeesComponent />
    </EmployeesContextProvider>
  );
};

export default Employees;
