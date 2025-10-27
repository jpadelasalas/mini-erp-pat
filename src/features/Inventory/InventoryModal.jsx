import React from "react";
import ModalComponent from "../../components/ModalComponent";
import { useInventoryFormData } from "../../context/InventoryContext";

const InventoryModal = ({ title, handleCloseModal }) => {
  const {
    values,
    handleChange,
    isError,
    handleSubmit,
    handleSubmitForm,
    handleDeleteItem,
  } = useInventoryFormData();
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
    <ModalComponent
      title={title}
      footer={footer}
      handleCloseModal={handleCloseModal}
    >
      {children}
    </ModalComponent>
  );
};

export default InventoryModal;
