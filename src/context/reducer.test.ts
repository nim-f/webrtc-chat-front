import React from "react";
import ReactDOM from "react-dom";

import { reducer } from "./reducer";
import { ADD_PEER, DELETE_PEER } from "src/actions/peerActions";

describe("test reducer", () => {
    it("should add peer", () => {
        const stream = {} as MediaStream;
        expect(
            reducer(
                {},
                {
                    type: ADD_PEER,
                    payload: { stream, userID: "1", name: "Ann" },
                }
            )
        ).toEqual({
            "1": { stream: stream },
        });
    });
    it("should delete peer", () => {
        const stream = {} as MediaStream;
        expect(
            reducer(
                {
                    "1": { stream, name: "Ann" },
                },
                { type: DELETE_PEER, payload: { userID: "1" } }
            )
        ).toEqual({});
    });
});
