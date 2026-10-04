import { SalesContextProvider } from "../context/SalesContext";
import SalesComponent from "../features/Sales/SalesComponent";

const Sales = () => {
  return (
    <SalesContextProvider>
      <SalesComponent />
    </SalesContextProvider>
  );
};

export default Sales;
