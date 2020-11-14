import React from "react";

const EmailInput = ({ input, meta }) => {
  return (
    <input
      {...input}
      type="email"
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};

export default EmailInput;
