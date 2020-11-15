import React from "react";

const ChatHeader = props => {
  return (
    <header className="chat-header">
      <h1>
        <i className="fas fa-smile"></i> Chat App
      </h1>
      <button className="btn" onClick={() => props.logout()}>
        Leave Chat
      </button>
    </header>
  );
};

export default ChatHeader;
