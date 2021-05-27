import React from "react";
import ReactDOM from "react-dom";
import { App } from "src/components/App/App";
import { ContextProvider } from "./context/SocketContext";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
    <Router>
        <ContextProvider>
            <App />
        </ContextProvider>
    </Router>,
    document.getElementById("App")
);
