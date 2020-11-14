import React from "react";

export const TextInput = ({ input, meta, placeholder }) => {
  return (
    <input
      {...input}
      type="text"
      placeholder={placeholder}
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};
