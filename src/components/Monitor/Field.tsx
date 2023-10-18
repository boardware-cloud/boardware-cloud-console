import React from "react";

interface IProps {
  label?: String;
  children?: JSX.Element;
}

const Field: React.FC<IProps> = ({ label, children }) => {
  return (
    <div>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
};

export default Field;
