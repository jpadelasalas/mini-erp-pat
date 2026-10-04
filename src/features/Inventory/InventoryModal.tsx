import ModalComponent from "../../components/ModalComponent";
import Field from "../../components/Field";
import {
  useInventoryFormData,
  useInventoryModalData,
} from "../../context/InventoryContext";
import { inputClass } from "../../lib/ui";

const InventoryModal = () => {
  const { title, isEditing, handleCloseModal } = useInventoryModalData();
  const { values, handleChange, isError, handleSubmit, handleSubmitForm, handleDeleteItem } =
    useInventoryFormData();

  return (
    <ModalComponent
      title={title}
      badge={values.itemNum}
      submitLabel={isEditing ? "Save changes" : "Add item"}
      onClose={handleCloseModal}
      onSubmit={handleSubmit(handleSubmitForm)}
      onDelete={isEditing ? () => handleDeleteItem(values.itemNum) : undefined}
    >
      <Field label="Name" required error={isError.name}>
        <input name="name" className={inputClass(isError.name)} value={values.name} onChange={handleChange} />
      </Field>
      <Field label="Category" required error={isError.category}>
        <input name="category" className={inputClass(isError.category)} value={values.category} onChange={handleChange} />
      </Field>
      <Field label="Description" className="md:col-span-2">
        <input name="description" className={inputClass()} value={values.description} onChange={handleChange} />
      </Field>
      <Field label="Quantity" required error={isError.quantity}>
        <input
          type="number"
          name="quantity"
          className={`${inputClass(isError.quantity)} font-mono`}
          value={values.quantity}
          onChange={handleChange}
        />
      </Field>
      <Field label="Price" required error={isError.price}>
        <input
          type="number"
          name="price"
          step="0.01"
          className={`${inputClass(isError.price)} font-mono`}
          value={values.price}
          onChange={handleChange}
        />
      </Field>
      {isEditing && (
        <p className="flex flex-wrap gap-x-5 gap-y-1 rounded-[9px] bg-paper px-3.5 py-3 text-xs text-faint md:col-span-2">
          <span>
            Created <span className="font-mono text-muted">{values.date_created}</span>
          </span>
          <span>
            Last updated <span className="font-mono text-muted">{values.updated_at}</span>
          </span>
        </p>
      )}
    </ModalComponent>
  );
};

export default InventoryModal;
