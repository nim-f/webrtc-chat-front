import React from "react";
import ReactDOM from "react-dom";
import { App } from "src/components/App/App";
import { ContextProvider } from "./context/SocketContext";
import { BrowserRouter as Router } from "react-router-dom";
import {CssBaseline} from "@material-ui/core";

ReactDOM.render(
    <Router>
        <ContextProvider>
            <CssBaseline />
            <App />
        </ContextProvider>
    </Router>,
    document.getElementById("App")
);
