import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const ToastContext = React.createContext();

const getPosition = position => {
  switch (position) {
    case "top-right":
      return css`
        top: 0;
        right: 0;
      `;
    case "bottom-right":
      return css`
        bottom: 0;
        right: 0;
      `;
    case "top-left":
      return css`
        top: 0;
        left: 0;
      `;
    case "top-center":
      return css`
        top: 0;
        left: calc(50% - 150px);
      `;
    case "bottom-center":
      return css`
        bottom: 0;
        left: calc(50% - 150px);
      `;
    default:
      return css`
        bottom: 0;
        left: 0;
      `;
  }
};
// Provider
// ==============================
let toastCount = 0;

export const ToastContextProvider = ({ position, children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(id => {
    setToasts(toastList => toastList.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(toastObject => {
    toastCount += 1;
    setToasts(toastList => [...toastList, { ...toastObject, id: toastCount }]);
    return toastCount;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, remove, toasts }}>
      {children}
      {ReactDOM.createPortal(
        <div>
          {toasts.map(toastOptions => (
            <div key={toastOptions.id} remove={remove} position={position}>
              {" "}
              {toastOptions.content}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

ToastContextProvider.propTypes = {
  position: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ToastContextProvider.defaultProps = {
  position: "bottom-right",
};

// Hook
// ==============================
const useToast = () => React.useContext(ToastContext);

/* @component */
export default useToast;
