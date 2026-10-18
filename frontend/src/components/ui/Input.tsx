import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import "./Input.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  hint?: string;
  inputSize?: "default" | "small";
};

export default function Input({
  label,
  hint,
  id,
  type = "text",
  inputSize = "default",
  className = "",
  ...props
}: InputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isPassword = type === "password";
  const actualType = isPassword && visible ? "text" : type;

  return (
    <div className={`form-field ${inputSize === "small" ? "form-field-small" : ""}`}>
      <label htmlFor={inputId}>{label}</label>
      <div className="input-shell">
        <input
          id={inputId}
          type={actualType}
          className={className}
          {...props}
        />
        {isPassword && (
          <button
            className="password-toggle"
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {hint && <small className="input-hint">{hint}</small>}
    </div>
  );
}
