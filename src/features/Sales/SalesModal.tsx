import ModalComponent from "../../components/ModalComponent";
import Field from "../../components/Field";
import { useSalesFormData, useSalesModalData } from "../../context/SalesContext";
import { inputClass } from "../../lib/ui";

const SalesModal = () => {
  const { title, isEditing, handleCloseModal } = useSalesModalData();
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

  return (
    <ModalComponent
      title={title}
      badge={values.salesNum}
      submitLabel={isEditing ? "Save changes" : "Record sale"}
      onClose={handleCloseModal}
      onSubmit={handleSubmit(handleSubmitForm)}
      onDelete={isEditing ? () => handleDeleteItem(values.salesNum) : undefined}
    >
      <Field label="Item" required error={isError.itemNum} className="md:col-span-2">
        <select name="itemNum" className={inputClass(isError.itemNum)} value={values.itemNum} onChange={handleItemChange}>
          <option value="">Select an item</option>
          {memoizedItems}
        </select>
      </Field>
      <Field label="Quantity sold" required error={isError.quantity_sold}>
        <input
          type="number"
          name="quantity_sold"
          className={`${inputClass(isError.quantity_sold)} font-mono`}
          value={values.quantity_sold}
          onChange={handleQuantitySoldChange}
        />
      </Field>
      <Field label="Total price" required error={isError.total_price}>
        <input type="number" name="total_price" className={inputClass(isError.total_price)} value={values.total_price} readOnly />
      </Field>
      <Field label="Sold at" required error={isError.sold_at}>
        <input
          type="datetime-local"
          name="sold_at"
          className={`${inputClass(isError.sold_at)} font-mono`}
          value={values.sold_at}
          onChange={handleChange}
        />
      </Field>
      <Field label="Customer name">
        <input name="customer_name" className={inputClass()} value={values.customer_name} onChange={handleChange} />
      </Field>
    </ModalComponent>
  );
};

export default SalesModal;
