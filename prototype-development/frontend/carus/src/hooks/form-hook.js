import * as React from "react";

const reducer = (state, action) => {
  //Sets the state and determines the validity of the form
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;

      //Identify the component on which the change occured
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      //Dynamic update of the state and the form validity
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [state, dispatch] = React.useReducer(reducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const updateInput = (id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  };

  const inputHandler = (eventID, eventValue, setValidationError, inputType) => {
    let regex;
    let isValid;

    switch (inputType) {
      case "OnlyLetterInput":
        regex = /^[A-Za-z\s-]+$/;
        isValid = regex.test(eventValue) && eventValue !== "";
        break;
      case "OnlyNumberInput":
        regex = /^[\d.]+$/;
        isValid = regex.test(eventValue) && eventValue !== "";
        break;
      case "OnlyNumberOrLetterInput":
        regex = /^[a-zA-Z0-9]+$/;
        isValid = regex.test(eventValue) && eventValue !== "";
        break;
      case "EmailInput":
        regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        isValid = regex.test(eventValue) && eventValue !== "";
        break;
      case "PasswordInput":
        isValid = eventValue.length >= 12 && eventValue !== "";
        break;
      case "ReenteredPasswordInput":
        isValid =
          eventValue === state.inputs.password.value && eventValue !== "";
        break;
      case "StartDateTimeInput":
        isValid = eventValue !== "" && eventValue !== null;
        break;
      case "EndDateTimeInput":
        isValid = eventValue !== "" && eventValue !== null;
        break;
      case "CheckmarkInput":
        isValid = eventValue;
        break;
      case "True":
        isValid = true;
        break;
      case "NotEmpty":
        isValid = eventValue !== "";
        break;
      default:
        isValid = eventValue !== "";
        break;
    }

    setValidationError(!isValid);
    updateInput(eventID, eventValue, isValid);
  };

  return [state, inputHandler];
};
