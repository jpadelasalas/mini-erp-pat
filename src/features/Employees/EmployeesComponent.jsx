import { TablePagination } from "@mui/material";
import ModalComponent from "../../components/ModalComponent";
import { useEmployees } from "../../context/EmployeesContext";

const EmployeesComponent = () => {
  const {
    search,
    handleSearch,
    isOpenModal,
    title,
    handleCloseModal,
    values,
    handleChange,
    isError,
    handleSubmitForm,
    handleSubmit,
    handleOpenModal,
    paginatedData,
    onEdit,
    handleDeleteItem,
    totalData,
    currentPage,
    dataPerPage,
    handlePageChange,
    handleRowsPerPageChange,
  } = useEmployees();

  const children = (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 md:gap-2">
      <div className="m-1 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2">
        <div className="col-span-1">
          <label htmlFor="">
            {" "}
            <span className="text-red-500">*</span>Employee ID
          </label>
          <input
            type="text"
            name="employeeId"
            className={`border-1 my-1 px-2 py-1 rounded-sm w-full cursor-not-allowed ${
              isError.employeeId ? "border-red-500" : "border-black"
            }`}
            value={values.employeeId}
            onChange={handleChange}
            readOnly
          />
        </div>
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Last Name
        </label>
        <input
          type="text"
          name="last_name"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.last_name ? "border-red-500" : "border-black"
          }`}
          value={values.last_name}
          onChange={handleChange}
        />
        {isError.last_name && (
          <span className="text-red-500">{isError.last_name}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>First Name
        </label>
        <input
          type="text"
          name="first_name"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.first_name ? "border-red-500" : "border-black"
          }`}
          value={values.first_name}
          onChange={handleChange}
        />
        {isError.first_name && (
          <span className="text-red-500">{isError.first_name}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Position
        </label>
        <input
          type="text"
          name="position"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.position ? "border-red-500" : "border-black"
          }`}
          value={values.position}
          onChange={handleChange}
        />
        {isError.position && (
          <span className="text-red-500">{isError.position}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Email
        </label>
        <input
          type="email"
          name="email"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.email ? "border-red-500" : "border-black"
          }`}
          value={values.email}
          onChange={handleChange}
        />
        {isError.email && <span className="text-red-500">{isError.email}</span>}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Status
        </label>
        <select
          name="status"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.status ? "border-red-500" : "border-black"
          }`}
          value={values.status}
          onChange={handleChange}
        >
          <option value="">--Select Status--</option>
          <option value="AC">Active</option>
          <option value="RE">Resigned</option>
        </select>
        {isError.status && (
          <span className="text-red-500">{isError.status}</span>
        )}
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="">
          {" "}
          <span className="text-red-500">*</span>Joined At
        </label>
        <input
          type="datetime-local"
          name="joined_at"
          className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
            isError.joined_at ? "border-red-500" : "border-black"
          }`}
          value={values.joined_at}
          onChange={handleChange}
        />
        {isError.joined_at && (
          <span className="text-red-500">{isError.joined_at}</span>
        )}
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
      {title !== "Add New Employee" && (
        <button
          className="border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400 cursor-pointer"
          onClick={() => handleDeleteItem(values.employeeId)}
        >
          Delete
        </button>
      )}
      <button
        className="border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400 cursor-pointer"
        onClick={handleSubmit(handleSubmitForm)}
      >
        {title === "Add New Employee" ? "Add" : "Update"}
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
                Employee ID
              </th>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Position
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <tr
                  key={`${index}-${item.employeeId}`}
                  className="odd:bg-white even:bg-violet-200 border-b cursor-pointer hover:odd:bg-gray-100 hover:even:bg-violet-300"
                  onDoubleClick={() => onEdit(item)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {item.employeeId}
                  </th>
                  <td className="px-6 py-4">{item.last_name}</td>
                  <td className="px-6 py-4">{item.first_name}</td>
                  <td className="px-6 py-4">{item.position}</td>
                  <td className="px-6 py-4">
                    {item.status === "AC" ? "Active" : "Resigned"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="odd:bg-white even:bg-violet-200 border-b">
                <td className="px-6 py-4 text-center" colSpan={5}>
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
          children={children}
          footer={footer}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default EmployeesComponent;
