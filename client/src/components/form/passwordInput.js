import React from "react";

const PasswordInput = ({ input, meta, placeholder }) => {
  return (
    <input
      {...input}
      type="password"
      placeholder={placeholder}
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};

export default PasswordInput;
