import React from "react";

interface Props {
  text: string;
}

export const FormError: React.FC<Props> = ({ text }) => {
  return (
    <p
      style={{
        color: "red",
        fontWeight: "500",
        fontSize: "14px",
      }}
    >
      {text}
    </p>
  );
};
