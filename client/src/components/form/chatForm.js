import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import { TextInput } from "./textInput";

let ChatForm = ({
  handleSubmit,
  onSubmit,
  pristine = false,
  submitting = false,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="chat-form">
      <Field
        name="msg"
        component={TextInput}
        placeholder="Enter Msg"
        autoComplete="off"
        required
      />
      <button className="btn" disabled={pristine || submitting}>
        <i className="fas fa-paper-plane"></i> Send
      </button>
    </form>
  );
};

ChatForm = reduxForm({
  form: "chat-form",
})(ChatForm);

export default connect(null, {})(ChatForm);
