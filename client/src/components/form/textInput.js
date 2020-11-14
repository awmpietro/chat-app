import React from "react";

export const TextInput = ({ input, meta }) => {
  return (
    <input
      {...input}
      type="text"
      error={meta.touched ? meta.error : null}
      className={meta.touched && meta.error ? "error" : ""}
    />
  );
};
