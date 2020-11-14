import React from "react";

const PasswordInput = ({ input, meta }) => {
  return (
    <input
      {...input}
      type="password"
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};

export default PasswordInput;
