import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Instance } from "simple-peer";

import { reducer, initialState } from "./reducer";
import { ADD_PEER, DELETE_PEER } from "src/actions/peerActions";

describe("test reducer", () => {
    it("should add peer", () => {
        const newPeer = {} as Instance;
        expect(
            reducer(
                {},
                { type: ADD_PEER, payload: { peer: newPeer, socket_id: "1" } }
            )
        ).toEqual({
            "1": { peer: newPeer },
        });
    });
    it("should delete peer", () => {
        const newPeer = {} as Instance;

        expect(
            reducer(
                {
                    "1": { peer: newPeer },
                },
                { type: DELETE_PEER, payload: { socket_id: "1" } }
            )
        ).toEqual({});
    });
});
