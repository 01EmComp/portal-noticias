import React from "react";
import "./style.css";

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="checkmark"></span>
      {label}
    </label>
  );
}

export default Checkbox;
