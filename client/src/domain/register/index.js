import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { register } from "../../store/actions";
import JoinHeader from "../../components/layout/joinHeader";
import RegisterForm from "../../components/form/registerForm";

const Register = props => {
  useEffect(() => {
    if (props.isSignedIn) {
      props.history.push("/");
    }
  }, [props.isSignedIn]);
  const onSubmit = values => {
    return props.register(values);
  };
  return (
    <div className="join-container">
      <JoinHeader />
      <main className="join-main">
        <RegisterForm onSubmit={onSubmit} />
        <div className="sign-link">
          Click <Link to="/login">here </Link>to login
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => {
  const { messages, isSignedIn } = state.chat;
  return { messages, isSignedIn };
};

export default connect(mapStateToProps, { register })(Register);
