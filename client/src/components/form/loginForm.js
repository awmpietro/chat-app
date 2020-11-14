import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import EmailInput from "./emailInput";
import PasswordInput from "./passwordInput";

let LoginForm = ({
  handleSubmit,
  onSubmit,
  pristine = false,
  submitting = false,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="chat-form">
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <Field
          name="email"
          id="email"
          component={EmailInput}
          placeholder="Your Email"
          required
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <Field
          name="password"
          id="password"
          component={PasswordInput}
          placeholder="Your Password"
          required
        />
      </div>
      <button className="btn" disabled={pristine || submitting}>
        <i className="fas fa-paper-plane"></i> Login
      </button>
    </form>
  );
};

LoginForm = reduxForm({
  form: "login-form",
})(LoginForm);

export default connect(null, {})(LoginForm);
