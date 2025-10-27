import { TablePagination } from "@mui/material";
import {
  useSalesModalData,
  useSalesParentData,
} from "../../context/SalesContext";
import SalesModal from "./SalesModal";

const SalesComponent = () => {
  const {
    paginatedData,
    search,
    handleSearch,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
  } = useSalesParentData();

  const { isOpenModal, title, handleOpenModal, handleCloseModal, onEdit } =
    useSalesModalData();

  return (
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <input
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 focus:ring-black focus:border-black"
          placeholder="Search Sales"
          value={search}
          onChange={handleSearch}
        />
        <div className="text-end mx-5">
          <button
            className="p-2 w-1/2 sm:w-3/4 rounded-md bg-violet-400 active:border-1 hover:bg-violet-500 active:bg-violet-300 cursor-pointer"
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
                Sales No.
              </th>
              <th scope="col" className="px-6 py-3">
                Item No.
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity Sold
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                Sold At
              </th>
              <th scope="col" className="px-6 py-3">
                Customer Name
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <tr
                  key={`${index}-${item.itemNum}`}
                  className="odd:bg-white even:bg-violet-200 border-b cursor-pointer hover:odd:bg-gray-100 hover:even:bg-violet-300"
                  onDoubleClick={() => onEdit(item)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {item.salesNum}
                  </th>
                  <td className="px-6 py-4">{item.itemNum}</td>
                  <td className="px-6 py-4">{item.quantity_sold}</td>
                  <td className="px-6 py-4">{item.total_price}</td>
                  <td className="px-6 py-4">
                    {item.sold_at.split("T")[0]} {item.sold_at.split("T")[1]}
                  </td>
                  <td className="px-6 py-4">{item.customer_name}</td>
                </tr>
              ))
            ) : (
              <tr className="odd:bg-white even:bg-violet-200 border-b">
                <td className="px-6 py-4 text-center" colSpan={6}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      </div>
      {isOpenModal && (
        <SalesModal title={title} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};

export default SalesComponent;
