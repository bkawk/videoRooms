import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom";
import { AppStateProvider } from './state/index';
import { App } from "./routes/App";
import { AddEvent } from "./routes/AddEvent";
import { ShowEvents } from "./routes/ShowEvents";
import { Event } from "./routes/Event";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <BrowserRouter>
    <AppStateProvider>
      <Switch>
        <Route exact path="/"><App/></Route>
        <Route exact path="/events/add-event" component={AddEvent} />
        <Route exact path="/events/show-events" component={ShowEvents} />
        <Route exact path="/events/:eventID" component={Event} />
      </Switch>
    </AppStateProvider>
  </BrowserRouter>, 
document.getElementById("root"));
serviceWorker.unregister();
