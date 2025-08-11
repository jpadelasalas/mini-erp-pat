import { TablePagination } from "@mui/material";
import { useInventory } from "../../context/InventoryContext";
import InventoryModal from "./InventoryModal";

const InventoryComponent = () => {
  const {
    search,
    setSearch,
    isOpenModal,
    handleOpenModal,
    onEdit,
    totalData,
    currentPage,
    dataPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    paginatedData,
  } = useInventory();
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
            {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <tr
                  key={`${index}-${item.itemNum}`}
                  className="odd:bg-white even:bg-violet-200 border-b cursor-pointer hover:odd:bg-gray-100 hover:even:bg-violet-300"
                  onDoubleClick={() => onEdit(item.itemNum)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {item.itemNum}
                  </th>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.date_created}</td>
                  <td className="px-6 py-4">{item.updated_at}</td>
                </tr>
              ))
            ) : (
              <tr className="odd:bg-white even:bg-violet-200 border-b">
                <td className="px-6 py-4 text-center" colSpan={8}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-5">
        <TablePagination
          component="div"
          count={totalData}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={dataPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
      {isOpenModal && <InventoryModal />}
    </>
  );
};

export default InventoryComponent;
