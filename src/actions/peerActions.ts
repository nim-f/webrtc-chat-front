export const DELETE_PEER = "DELETE_PEER" as const;
export const ADD_PEER = "ADD_PEER" as const;

export type TAction =
    | {
          type: typeof ADD_PEER;
          payload: { socket_id: string; stream: MediaStream };
      }
    | {
          type: typeof DELETE_PEER;
          payload: { socket_id: string };
      };

export const addPeerAction = (
    socket_id: string,
    stream: MediaStream
): TAction => ({
    type: ADD_PEER,
    payload: { socket_id, stream },
});

export const deletePeerAction = (socket_id: string): TAction => ({
    type: DELETE_PEER,
    payload: { socket_id },
});
