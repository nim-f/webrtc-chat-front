import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { render, fireEvent, cleanup, findByText } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";

import { App } from "./App";
import { ContextProvider } from "src/context/SocketContext";

afterEach(cleanup);
beforeEach(() => {
    global.fetch.resetMocks();
});

describe("App component", () => {
    it("should render home page", () => {
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={history}>
                <ContextProvider>
                    <App />
                </ContextProvider>
            </Router>
        );

        expect(getByText("Video chat")).toBeInTheDocument();
    });
    it("should go to room route", () => {
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={history}>
                <ContextProvider>
                    <App />
                </ContextProvider>
            </Router>
        );
        history.push("/room/123");

        expect(getByText("Room 123")).toBeInTheDocument();
    });
});

describe("App component", () => {
    it("should join a room by button click", async () => {
        const history = createMemoryHistory();
        const mockSuccessResponse = { link: "123" };
        global.fetch.mockResponseOnce(JSON.stringify(mockSuccessResponse));

        const { getByText, findByText } = render(
            <Router history={history}>
                <ContextProvider>
                    <App />
                </ContextProvider>
            </Router>
        );
        fireEvent.click(getByText("Join the room"));
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(await findByText("Room 123")).toBeInTheDocument();
        global.fetch.mockClear();
    });
});
