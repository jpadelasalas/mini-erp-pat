import { useCallback, useReducer, useState } from "react";

const funcDispatch = (state, action) => {
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

const useForm = (initialValues = null, validate) => {
  const [values, dispatch] = useReducer(funcDispatch, initialValues);
  const [isError, setIsError] = useState({});

  const validateForm = useCallback(
    (vals) => (validate ? validate(vals) : {}),
    [validate]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "ADD_INPUT", name, value });
  };

  const dispatchForm = useCallback((vals) => {
    dispatch({ type: "RESET_FORM", payload: vals });
    setIsError({});
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM", payload: initialValues });
    setIsError({});
  }, [initialValues]);

  const mergeForm = useCallback((vals) => {
    dispatch({ type: "MERGE_FORM", payload: vals });
    setIsError({});
  }, []);

  const handleSubmit = useCallback(
    (callback) => (e) => {
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
