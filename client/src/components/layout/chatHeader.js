import React from "react";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  return (
    <header className="chat-header">
      <h1>
        <i className="fas fa-smile"></i> Chat App
      </h1>
      <Link to={"/login"} className="btn">
        Leave Room
      </Link>
    </header>
  );
};

export default ChatHeader;
