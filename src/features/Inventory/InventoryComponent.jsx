import { TablePagination } from "@mui/material";
import { useInventory } from "../../context/InventoryContext";
import ModalComponent from "../../components/ModalComponent";

const InventoryComponent = () => {
  const {
    search,
    handleSearch,
    isOpenModal,
    handleOpenModal,
    onEdit,
    totalData,
    currentPage,
    dataPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    paginatedData,
    values,
    handleChange,
    isError,
    title,
    handleSubmit,
    handleSubmitForm,
    handleDeleteItem,
    handleCloseModal,
  } = useInventory();

  const children = (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 md:gap-2">
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Item No.
        </label>
        <input
          type="text"
          name="itemNum"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full cursor-not-allowed ${
            isError.itemNum ? "border-red-500" : "border-black"
          }`}
          value={values.itemNum}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Name
        </label>
        <input
          type="text"
          name="name"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.name ? "border-red-500" : "border-black"
          }`}
          value={values.name}
          onChange={handleChange}
        />
        {isError.name && <span className="text-red-500">{isError.name}</span>}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">Description</label>
        <input
          type="text"
          name="description"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.description ? "border-red-500" : "border-black"
          }`}
          value={values.description}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Catergory
        </label>
        <input
          type="text"
          name="category"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.category ? "border-red-500" : "border-black"
          }`}
          value={values.category}
          onChange={handleChange}
        />
        {isError.category && (
          <span className="text-red-500">{isError.category}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Quantity
        </label>
        <input
          type="number"
          name="quantity"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.quantity ? "border-red-500" : "border-black"
          }`}
          value={values.quantity}
          onChange={handleChange}
        />
        {isError.quantity && (
          <span className="text-red-500">{isError.quantity}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Price
        </label>
        <input
          type="number"
          name="price"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.price ? "border-red-500" : "border-black"
          }`}
          value={values.price}
          onChange={handleChange}
        />
        {isError.price && <span className="text-red-500">{isError.price}</span>}
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
      {title !== "Add New Inventory" && (
        <button
          className="border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400 cursor-pointer"
          onClick={() => handleDeleteItem(values.itemNum)}
        >
          Delete
        </button>
      )}
      <button
        className="border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400 cursor-pointer"
        onClick={handleSubmit(handleSubmitForm)}
      >
        {title === "Add New Inventory" ? "Add" : "Update"}
      </button>
    </div>
  );

  return (
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <input
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 focus:ring-black focus:border-black"
          placeholder="Search Inventory"
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
                  onDoubleClick={() => onEdit(item)}
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

export default InventoryComponent;
