import React from "react";
import ReactDOM from "react-dom";
import { FetchMock } from "jest-fetch-mock";
import { Router } from "react-router-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";

import { JoinButton } from "./index";
import { ContextProvider } from "src/context/SocketContext";

afterEach(cleanup);
beforeEach(() => {
    global.fetch.resetMocks();
});

describe("join button", () => {
    it("should render", () => {
        const { getByText } = render(
            <ContextProvider>
                <JoinButton />
            </ContextProvider>
        );
        expect(getByText("Join the room")).toBeInTheDocument();
    });

    it("should open a room", async () => {
        const history = createMemoryHistory();

        const { getByText } = render(
            <Router history={history}>
                <ContextProvider>
                    <JoinButton />
                </ContextProvider>
            </Router>
        );
        fireEvent.click(getByText("Join the room"));
        expect(global.fetch).toHaveBeenCalledTimes(1);
        global.fetch.mockClear();
        // delete global.fetch;
    });
});
