export const DELETE_PEER = "DELETE_PEER" as const;
export const ADD_PEER = "ADD_PEER" as const;

export type TAction =
    | {
          type: typeof ADD_PEER;
          payload: { userID: string; stream: MediaStream; name: string };
      }
    | {
          type: typeof DELETE_PEER;
          payload: { userID: string };
      };

export const addPeerAction = (
    userID: string,
    stream: MediaStream,
    name: string
): TAction => ({
    type: ADD_PEER,
    payload: { userID, stream, name },
});

export const deletePeerAction = (userID: string): TAction => ({
    type: DELETE_PEER,
    payload: { userID },
});
