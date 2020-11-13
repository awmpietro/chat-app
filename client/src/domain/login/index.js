import React from "react";
import JoinHeader from "../../components/layout/joinHeader";

const Login = () => {
  return (
    <div className="join-container">
      <JoinHeader />
      <main className="join-main">
        <form action="chat.html">
          <div className="form-control">
            <label for="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username..."
              required
            />
          </div>
          <div className="form-control">
            <label for="room">Room</label>
            <select name="room" id="room">
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <button type="submit" className="btn">
            Join Chat
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
