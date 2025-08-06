import { useInventory } from "../../context/InventoryContext";
import InventoryModal from "./InventoryModal";

const InventoryComponent = () => {
  const { search, setSearch, isOpenModal, handleOpenModal } = useInventory();
  return (
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <input
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 focus:ring-black focus:border-black"
          placeholder="Search Inventory"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-end mx-5">
          <button
            className="p-2 w-1/2 sm:w-3/4 rounded-md bg-blue-300 active:border-1 active:bg-blue-400"
            onClick={handleOpenModal}
          >
            Add New
          </button>
        </div>
      </header>

      <div className="my-5 mx-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-violet-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Item No.
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-violet-200 border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">Acer</td>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">$1000.00</td>
              <td className="px-6 py-4">12/24/2005</td>
              <td className="px-6 py-4">12/24/2025</td>
            </tr>
            <tr className="odd:bg-white even:bg-violet-200 border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">Acer</td>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">$1000.00</td>
              <td className="px-6 py-4">12/24/2005</td>
              <td className="px-6 py-4">12/24/2025</td>
            </tr>
            <tr className="odd:bg-white even:bg-violet-200 border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">Acer</td>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">$1000.00</td>
              <td className="px-6 py-4">12/24/2005</td>
              <td className="px-6 py-4">12/24/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
      {isOpenModal && <InventoryModal title={"Add New Inventory"} />}
    </>
  );
};

export default InventoryComponent;
