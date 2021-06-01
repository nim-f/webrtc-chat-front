import React from "react";
import ReactDOM from "react-dom";
import { FetchMock } from "jest-fetch-mock";
import { Router } from "react-router-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
                <JoinButton onClick={() => {}} />
            </ContextProvider>
        );
        expect(getByText("Join the room")).toBeInTheDocument();
    });

    it("should call an onclick handler", async () => {
        const mockFn = jest.fn();

        const { getByText } = render(
            <ContextProvider>
                <JoinButton onClick={mockFn} />
            </ContextProvider>
        );
        fireEvent.click(getByText("Join the room"));
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it("should update username", async () => {
        const mockFn = jest.fn();

        const { getByTestId } = render(
            <ContextProvider>
                <JoinButton onClick={mockFn} />
            </ContextProvider>
        );

        const inputEl = getByTestId("name");
        userEvent.type(inputEl, "Anna");
        expect(getByTestId("name")).toHaveValue("Anna");
    });
});
