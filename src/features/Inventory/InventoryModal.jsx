import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useInventory } from "../../context/InventoryContext";

const InventoryModal = React.memo(({ title }) => {
  const { values, handleChange, isError, handleCloseModal, handleSubmit } =
    useInventory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md text-sm md:text-md ">
        <div className="text-sm md:text-md lg:text-xl bg-violet-100 flex justify-between p-4 rounded-t-lg">
          <span className="font-semibold ">{title}</span>
          <CloseIcon onClick={handleCloseModal} className="cursor-pointer" />
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <div className="flex flex-col m-1">
            <label htmlFor="">Item No.</label>
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
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
                isError.name ? "border-red-500" : "border-black"
              }`}
              value={values.name}
              onChange={handleChange}
            />
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
            <label htmlFor="">Catergory</label>
            <input
              type="text"
              name="category"
              className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
                isError.category ? "border-red-500" : "border-black"
              }`}
              value={values.category}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col m-1">
            <label htmlFor="">Quantity</label>
            <input
              type="number"
              name="quantity"
              className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${
                isError.quantity ? "border-red-500" : "border-black"
              }`}
              value={values.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col m-1">
            <label htmlFor="">Price</label>
            <input
              type="number"
              name="price"
              className={`border-1 my-1 px-2 py-1 rounded-sm w-full ${isError}`}
              value={values.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end px-4 pb-2 mb-3">
          <button className="border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400">
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default InventoryModal;
