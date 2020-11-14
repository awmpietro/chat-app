import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";

import { socketHandle, chatMessage } from "../../store/actions";
import ChatHeader from "../../components/layout/chatHeader";
import ChatForm from "../../components/form/chatForm";

const Chat = props => {
  useEffect(() => {
    return !props.isSignedIn ? props.history.push("/login") : null;
  }, [props.isSignedIn]);

  useEffect(() => {
    props.socketHandle();
  }, []);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [props.messages]);

  const onSubmit = values => {
    const { msg } = values;
    return props.chatMessage(msg);
  };

  return (
    <div className="chat-container">
      <ChatHeader />
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name"></h2>
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
                  {props.user.name} <span>{msg.date}</span>
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

export default connect(mapStateToProps, { socketHandle, chatMessage })(Chat);
