import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./domain/login";
import Register from "./domain/register";
import Chat from "./domain/chat";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route exact={true} path="/" component={Chat} />;
        <Route exact={true} path="/login" component={Login} />;
        <Route exact={true} path="/register" component={Register} />;
      </Switch>
    </BrowserRouter>
  );
};

export default App;
