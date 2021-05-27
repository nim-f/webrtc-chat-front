import { Instance } from "simple-peer";
import { ADD_PEER, DELETE_PEER, TAction } from "../actions/peerActions";

type TState = Record<string, { peer: Instance }>;

export const initialState = {};

export const reducer = (
    state: TState = initialState,
    action: TAction
): TState => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.socket_id]: { peer: action.payload.peer },
            };
        case DELETE_PEER:
            const { [action.payload.socket_id]: deleted, ...rest } = state;
            return { ...rest };
        default:
            return { ...state };
        // throw new Error();
    }
};
