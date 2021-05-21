import { Instance } from "simple-peer";
import { TAction } from "../SocketContext";

export const ADD_STREAM = "ADD_STREAM";
export const DELETE_PEER = "DELETE_PEER";
export const ADD_PEER = "ADD_PEER";

export const addPeerAction = (socket_id: string, peer: Instance): TAction => ({
    type: ADD_PEER,
    payload: { socket_id, peer },
});
