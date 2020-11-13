import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./domain/login";
import Chat from "./domain/chat";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route exact={true} path="/" component={Chat} />;
        <Route exact={true} path="/login" component={Login} />;
      </Switch>
    </BrowserRouter>
  );
};

export default App;
