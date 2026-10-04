import ModalComponent from "../../components/ModalComponent";
import Field from "../../components/Field";
import {
  useEmployeesFormData,
  useEmployeesModalData,
} from "../../context/EmployeesContext";
import { inputClass } from "../../lib/ui";

const EmployeeModal = () => {
  const { title, isEditing, handleCloseModal } = useEmployeesModalData();
  const { values, handleChange, isError, handleSubmitForm, handleSubmit, handleDeleteItem } =
    useEmployeesFormData();

  return (
    <ModalComponent
      title={title}
      badge={values.employeeId}
      submitLabel={isEditing ? "Save changes" : "Add employee"}
      onClose={handleCloseModal}
      onSubmit={handleSubmit(handleSubmitForm)}
      onDelete={isEditing ? () => handleDeleteItem(values.employeeId) : undefined}
    >
      <Field label="Last name" required error={isError.last_name}>
        <input name="last_name" className={inputClass(isError.last_name)} value={values.last_name} onChange={handleChange} />
      </Field>
      <Field label="First name" required error={isError.first_name}>
        <input name="first_name" className={inputClass(isError.first_name)} value={values.first_name} onChange={handleChange} />
      </Field>
      <Field label="Position" required error={isError.position}>
        <input name="position" className={inputClass(isError.position)} value={values.position} onChange={handleChange} />
      </Field>
      <Field label="Email" required error={isError.email}>
        <input type="email" name="email" className={inputClass(isError.email)} value={values.email} onChange={handleChange} />
      </Field>
      <Field label="Status" required error={isError.status}>
        <select name="status" className={inputClass(isError.status)} value={values.status} onChange={handleChange}>
          <option value="">Select status</option>
          <option value="AC">Active</option>
          <option value="RE">Resigned</option>
        </select>
      </Field>
      <Field label="Joined at" required error={isError.joined_at}>
        <input
          type="datetime-local"
          name="joined_at"
          className={`${inputClass(isError.joined_at)} font-mono`}
          value={values.joined_at}
          onChange={handleChange}
        />
      </Field>
    </ModalComponent>
  );
};

export default EmployeeModal;
