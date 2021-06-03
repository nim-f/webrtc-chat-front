import { ADD_PEER, DELETE_PEER, TAction } from "../actions/peerActions";

type TState = Record<string, { stream: MediaStream; name: string }>;

export const initialState = {};

export const reducer = (
    state: TState = initialState,
    action: TAction
): TState => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.userID]: {
                    stream: action.payload.stream,
                    name: action.payload.name,
                },
            };
        case DELETE_PEER:
            const { [action.payload.userID]: deleted, ...rest } = state;
            return { ...rest };
        default:
            return { ...state };
        // throw new Error();
    }
};
