import { InventoryContextProvider } from "../context/InventoryContext";
import InventoryComponent from "../features/Inventory/InventoryComponent";

const Inventory = () => {
  return (
    <InventoryContextProvider>
      <InventoryComponent />
    </InventoryContextProvider>
  );
};

export default Inventory;
