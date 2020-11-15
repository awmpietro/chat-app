import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import EmailInput from "./emailInput";
import PasswordInput from "./passwordInput";
import { TextInput } from "./textInput";

let RegisterForm = ({
  handleSubmit,
  onSubmit,
  pristine = false,
  submitting = false,
  isError,
  errorMessage,
}) => {
  const showErrors = () => {
    if (isError) {
      return <div className="form-control error-message">{errorMessage}</div>;
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="chat-form">
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <Field
          name="name"
          id="name"
          component={TextInput}
          placeholder="Your Name"
          required
        />
      </div>
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
      <div className="form-control">
        <label htmlFor="room">Room</label>
        <Field name="room" component="select" id="room">
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="PHP">PHP</option>
          <option value="C#">C#</option>
          <option value="Ruby">Ruby</option>
          <option value="Java">Java</option>
        </Field>
      </div>
      <button className="btn" disabled={pristine || submitting}>
        <i className="fas fa-paper-plane"></i> Register
      </button>
      {showErrors()}
    </form>
  );
};

RegisterForm = reduxForm({
  form: "register-form",
  initialValues: {
    room: "JavaScript",
  },
})(RegisterForm);

const mapStateToProps = state => {
  const { errorMessage, isError } = state.chat;
  return { errorMessage, isError };
};

export default connect(mapStateToProps, {})(RegisterForm);
