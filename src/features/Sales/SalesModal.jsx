import ModalComponent from "../../components/ModalComponent";
import { useSalesFormData } from "../../context/SalesContext";

const SalesModal = ({ handleCloseModal, title }) => {
  const {
    memoizedItems,
    values,
    handleChange,
    handleItemChange,
    handleQuantitySoldChange,
    isError,
    handleSubmit,
    handleSubmitForm,
    handleDeleteItem,
  } = useSalesFormData();

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
          className="border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400 cursor-pointer"
          onClick={() => handleDeleteItem(values.salesNum)}
        >
          Delete
        </button>
      )}
      <button
        className="border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400 cursor-pointer"
        onClick={handleSubmit(handleSubmitForm)}
      >
        {title === "Add New Sales" ? "Add" : "Update"}
      </button>
    </div>
  );
  return (
    <ModalComponent
      title={title}
      footer={footer}
      handleCloseModal={handleCloseModal}
    >
      {children}
    </ModalComponent>
  );
};

export default SalesModal;
