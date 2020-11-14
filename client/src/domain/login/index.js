import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { login } from "../../store/actions";
import JoinHeader from "../../components/layout/joinHeader";
import LoginForm from "../../components/form/loginForm";

const Login = props => {
  useEffect(() => {
    if (props.isSignedIn) {
      props.history.push("/");
    }
  }, [props.isSignedIn]);
  const onSubmit = values => {
    return props.login(values);
  };
  return (
    <div className="join-container">
      <JoinHeader />
      <main className="join-main">
        <LoginForm onSubmit={onSubmit} />
        {/* <div className="form-control">
            <label for="room">Room</label>
            <select name="room" id="room">
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div> */}
        <div className="sign-link">
          Click <Link to="/register">here </Link>to create an account
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => {
  const { messages, isSignedIn } = state.chat;
  return { messages, isSignedIn };
};

export default connect(mapStateToProps, { login })(Login);
