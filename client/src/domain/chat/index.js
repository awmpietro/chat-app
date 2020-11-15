import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";

import { chatMessage, logout } from "../../store/actions";
import ChatHeader from "../../components/layout/chatHeader";
import ChatForm from "../../components/form/chatForm";

const Chat = props => {
  useEffect(() => {
    return !props.isSignedIn ? props.history.push("/login") : null;
  }, [props.isSignedIn]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [props.messages]);

  const onSubmit = (values, dispatch) => {
    const { chatMessage } = props;
    const { msg } = values;
    dispatch(reset("chat-form"));
    return chatMessage(msg);
  };

  const logout = () => {
    props.logout();
    props.history.push("/login");
  };

  return (
    <div className="chat-container">
      <ChatHeader logout={logout} />
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name
          </h3>
          <h2 id="room-name">{props.user.userRoom}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users"></ul>
        </div>
        <div className="chat-messages">
          {props.messages.map(msg => {
            return (
              <div className="message" key={msg.date}>
                <p className="meta">
                  {msg.user.userName} <span>{msg.date}</span>
                </p>
                <p className="text">{msg.message}</p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="chat-form-container">
        <ChatForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const { messages, user, isSignedIn } = state.chat;
  return { messages, user, isSignedIn };
};

export default connect(mapStateToProps, { chatMessage, logout })(Chat);
