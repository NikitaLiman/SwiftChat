import React from "react";
import { FormError } from "./FormError";
import { useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  classname?: string;
  additionalLabel?: string;
}

export const FormEdit: React.FC<Props> = ({
  name,
  label,
  required,
  placeholder,
  classname,
  additionalLabel,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(name);
  const error = errors[name]?.message as string;
  const hasValue = Boolean(value);

  return (
    <div
      className={`${classname} ${hasValue ? "has-text" : ""}`}
      style={{ position: "relative" }}
    >
      <input
        autoComplete="off"
        id={name}
        style={{ width: "100%" }}
        type="text"
        {...register(name)}
        placeholder={placeholder}
        {...props}
      />
      {additionalLabel && (
        <label htmlFor={name} className={hasValue ? "active-label" : ""}>
          {additionalLabel}
        </label>
      )}

      {/* {value && (
        <button
          style={{
            position: "absolute",
            right: "5px",
            top: "50%",
            transform: "translateY(-40%)",
          }}
        >
          <X onClick={onClickGear} size={16} />
        </button>
      )} */}

      {error && <FormError text={error} />}
    </div>
  );
};
