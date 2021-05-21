import React, {
    useEffect,
    createContext,
    useState,
    useRef,
    FC,
    useReducer,
} from "react";
import { io } from "socket.io-client";
import Peer, { Instance } from "simple-peer";
import { useHistory } from "react-router-dom";
import useDynamicRefs from "use-dynamic-refs";
import { addPeerAction } from "./actions/peerActions";

const SocketContext = createContext<null | any>(null);
const socket = io("http://localhost:5000");
/**
 * RTCPeerConnection configuration
 */

type TCall = {
    isReceivedCall: Boolean;
    from: any;
    name: string;
    signal: any;
};

export type TPeer = {
    socket_id: string;
    am_initiator: boolean;
    data?: any;
    stream: MediaStream;
};
export type TAction = {
    type: "ADD_PEER";
    payload: { socket_id: string; peer: Instance };
};

type TState = Record<string, { peer: Instance }>;

type TReducer<S, A> = (prevState: S, action: A) => S;

const reducer = (state: TState, action: TAction): TState => {
    switch (action.type) {
        case "ADD_PEER":
            return {
                ...state,
                [action.payload.socket_id]: { peer: action.payload.peer },
            };
        // TODO: delete peer funcitonal
        // case "DELETE_PEER":
        //     return { ...state };
        default:
            throw new Error();
    }
};

const ContextProvider: FC = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [name, setName] = useState<string>("");
    const [getRef, setRef] = useDynamicRefs();
    const history = useHistory();
    const myVideo = useRef<HTMLVideoElement>(null);

    const [peers, dispatch] = useReducer(reducer, {});

    useEffect(() => {
        socket.on("signal", (data) => {
            peers[data.socket_id].peer.signal(data.signal);
        });
        return () => {
            socket.off("signal");
        };
    }, [peers]);

    useEffect(() => {
        socket.on("initReceive", (socket_id) => {
            console.log("INIT RECEIVE " + socket_id);
            addPeer(socket_id, false);
            socket.emit("initSend", socket_id);
        });

        socket.on("initSend", (socket_id) => {
            console.log("INIT SEND " + socket_id);
            addPeer(socket_id, true);
        });

        socket.on("removePeer", (socket_id) => {
            console.log("removing peer " + socket_id);
            removePeer(socket_id);
        });

        socket.on("disconnect", () => {
            console.log("GOT DISCONNECTED");
            for (let socket_id in peers) {
                removePeer(socket_id);
            }
        });

        return () => {
            socket.off("initReceive");
            socket.off("initSend");
            socket.off("removePeer");
            socket.off("disconnect");
        };
    }, [stream]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });
    }, []);

    const addPeer = (socket_id: string, am_initiator: boolean | undefined) => {
        const newPeer = new Peer({
            initiator: am_initiator,
            stream: stream,
        });

        newPeer.on("signal", (data) => {
            socket.emit("signal", {
                signal: data,
                socket_id: socket_id,
            });
        });

        newPeer.on("stream", (stream) => {
            const video = getRef(
                socket_id
            ) as React.RefObject<HTMLVideoElement>;
            if (video && video.current) video.current.srcObject = stream;
        });

        dispatch(addPeerAction(socket_id, newPeer));
    };

    const removePeer = (socket_id: string) => {};

    const shareScreen = () => {
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia({}).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        });
    };

    const joinRoom = async () => {
        await fetch("http://localhost:5000/join").then((res) => {
            res.json().then((r) => {
                history.push(`/rrom/${r.link}`);
            });
        });
    };

    return (
        <SocketContext.Provider
            value={{
                myVideo,
                stream,
                name,
                setName,
                shareScreen,
                joinRoom,
                peers,
                setRef,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
