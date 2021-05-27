import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { reducer, initialState } from "./reducer";
import { ADD_PEER, DELETE_PEER } from "src/actions/peerActions";

describe("test reducer", () => {
    it("should return the initial state", () => {
        expect(reducer({}, {})).toEqual(initialState);
    });
    it("should add peer", () => {
        expect(
            reducer(
                {},
                { type: ADD_PEER, payload: { peer: "qwe", socket_id: "1" } }
            )
        ).toEqual({
            "1": { peer: "qwe" },
        });
    });
    it("should delete peer", () => {
        expect(
            reducer(
                {
                    "1": { peer: "qwe" },
                },
                { type: DELETE_PEER, payload: { socket_id: "1" } }
            )
        ).toEqual({});
    });
});
