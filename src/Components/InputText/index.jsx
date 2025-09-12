import React from "react";
import "./style.css";

function InputText({ label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="input-container">
      <label htmlFor={name} className="input-label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
}

export default InputText;
