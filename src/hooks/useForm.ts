import { useCallback, useReducer, useState, type ChangeEvent } from "react";
import type { FormErrors } from "../types";

export type FormAction<T> =
  | { type: "ADD_INPUT"; name: string; value: unknown }
  | { type: "RESET_FORM"; payload: T }
  | { type: "MERGE_FORM"; payload: Partial<T> };

const funcDispatch = <T,>(state: T, action: FormAction<T>): T => {
  switch (action.type) {
    case "ADD_INPUT":
      return {
        ...state,
        [action.name]: action.value,
      };
    case "RESET_FORM":
      return action.payload;
    case "MERGE_FORM":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

const useForm = <T extends object>(
  initialValues: T,
  validate?: (vals: T) => FormErrors<T>
) => {
  const [values, dispatch] = useReducer(funcDispatch<T>, initialValues);
  const [isError, setIsError] = useState<FormErrors<T>>({});

  const validateForm = useCallback(
    (vals: T) => (validate ? validate(vals) : {}),
    [validate]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      dispatch({ type: "ADD_INPUT", name, value });
    },
    []
  );

  const dispatchForm = useCallback((vals: T) => {
    dispatch({ type: "RESET_FORM", payload: vals });
    setIsError({});
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM", payload: initialValues });
    setIsError({});
  }, [initialValues]);

  const mergeForm = useCallback((vals: Partial<T>) => {
    dispatch({ type: "MERGE_FORM", payload: vals });
    setIsError({});
  }, []);

  const handleSubmit = useCallback(
    (callback: (vals: T) => void) => (e: { preventDefault(): void }) => {
      e.preventDefault();
      const errors = validateForm(values);
      setIsError(errors);

      if (Object.keys(errors).length === 0) {
        callback(values);
        setIsError({});
      }
    },
    [validateForm, values]
  );

  return {
    values,
    dispatch,
    handleChange,
    isError,
    handleSubmit,
    dispatchForm,
    mergeForm,
    resetForm,
  };
};

export default useForm;
