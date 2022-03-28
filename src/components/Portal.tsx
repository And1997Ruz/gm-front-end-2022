import React from "react";
import ReactDOM from "react-dom";

const Portal: React.FC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default Portal;
