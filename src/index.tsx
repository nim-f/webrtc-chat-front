import React from "react";
import ReactDOM from "react-dom";
import { App } from "src/components/App/App";
import { ContextProvider } from "./SocketContext";

ReactDOM.render(
    <ContextProvider>
        <App />
    </ContextProvider>,
    document.getElementById("App")
);
