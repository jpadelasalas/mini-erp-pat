import React, { useCallback, useReducer, useState } from "react";

const funcDispatch = (state, action) => {
  switch (action.type) {
    case "ADD_INPUT":
      return {
        ...state,
        [action.name]: action.value,
      };
    case "RESET_FORM":
      return action.payload;
    default:
      return state;
  }
};

const useForm = (initialValues, validate) => {
  const [values, dispatch] = useReducer(funcDispatch, initialValues);
  const [isError, setIsError] = useState({});

  const validateForm = useCallback(
    (vals) => (validate ? validate(vals) : {}),
    [validate]
  );

  const handleChange = (e) => {
    console.log(initialValues, values);

    const { name, value } = e.target;
    dispatch({ type: "ADD_INPUT", name, value });
  };

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM", payload: initialValues });
    setIsError({});
  }, [initialValues]);

  const handleSubmit = useCallback(
    (callback) => (e) => {
      e.preventDefault;
      const errors = validateForm(values);
      setIsError(errors);

      if (Object.keys(errors).length === 0) {
        callback(values);
      }
    },
    [validateForm, values]
  );

  return {
    values,
    handleChange,
    isError,
    handleSubmit,
    resetForm,
  };
};

export default useForm;
