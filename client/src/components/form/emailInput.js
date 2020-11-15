import React from "react";

const EmailInput = ({ input, meta, placeholder }) => {
  return (
    <input
      {...input}
      type="email"
      placeholder={placeholder}
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};

export default EmailInput;
