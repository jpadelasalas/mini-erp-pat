import { TablePagination } from "@mui/material";
import ModalComponent from "../../components/ModalComponent";
import { useSales } from "../../context/SalesContext";

const SalesComponent = () => {
  const {
    paginatedData,
    isOpenModal,
    memoizedItems,
    title,
    search,
    handleSearch,
    handleOpenModal,
    handleCloseModal,
    values,
    isError,
    handleChange,
    handleItemChange,
    handleQuantitySoldChange,
    handleSubmit,
    handleSubmitForm,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
  } = useSales();

  const children = (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 md:gap-2">
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Sales No.
        </label>
        <input
          type="text"
          name="salesNum"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full cursor-not-allowed ${
            isError.salesNum ? "border-red-500" : "border-black"
          }`}
          value={values.salesNum}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Item
        </label>
        <select
          name="itemNum"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.itemNum ? "border-red-500" : "border-black"
          }`}
          value={values.itemNum}
          onChange={handleItemChange}
        >
          <option value="">--Select Item--</option>
          {memoizedItems}
        </select>
        {isError.itemNum && (
          <span className="text-red-500">{isError.itemNum}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Quantity Sold
        </label>
        <input
          type="number"
          name="quantity_sold"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.quantity_sold ? "border-red-500" : "border-black"
          }`}
          value={values.quantity_sold}
          onChange={handleQuantitySoldChange}
        />
        {isError.quantity_sold && (
          <span className="text-red-500">{isError.quantity_sold}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Total Price
        </label>
        <input
          type="number"
          name="total_price"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full cursor-not-allowed ${
            isError.total_price ? "border-red-500" : "border-black"
          }`}
          value={values.total_price}
          readOnly
        />
        {isError.total_price && (
          <span className="text-red-500">{isError.total_price}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Sold At
        </label>
        <input
          type="datetime-local"
          name="sold_at"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.sold_at ? "border-red-500" : "border-black"
          }`}
          value={values.sold_at}
          onChange={handleChange}
        />
        {isError.sold_at && (
          <span className="text-red-500">{isError.sold_at}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">Customer Name</label>
        <input
          type="text"
          name="customer_name"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.customer_name ? "border-red-500" : "border-black"
          }`}
          value={values.customer_name}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
      {title !== "Add New Sales" && (
        <button
          className="border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400"
          //   onClick={() => handleDeleteItem(values.itemNum)}
        >
          Delete
        </button>
      )}
      <button
        className="border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400"
        onClick={handleSubmit(handleSubmitForm)}
      >
        {title === "Add New Sales" ? "Add" : "Update"}
      </button>
    </div>
  );
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
                  //   onDoubleClick={() => onEdit(item.itemNum)}
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
        <ModalComponent
          title={title}
          footer={footer}
          children={children}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default SalesComponent;
