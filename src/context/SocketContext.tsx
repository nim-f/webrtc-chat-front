import React, {
    useEffect,
    createContext,
    useState,
    useRef,
    FC,
    useReducer,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useHistory } from "react-router-dom";
import useDynamicRefs from "use-dynamic-refs";
import { addPeerAction, deletePeerAction } from "../actions/peerActions";
import { reducer } from "./reducer";

const SocketContext = createContext<null | any>(null);
const socket = io("http://localhost:5000");

export type TPeer = {
    socket_id: string;
    am_initiator: boolean;
    data?: any;
    stream: MediaStream;
};

const ContextProvider: FC = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [name, setName] = useState<string>("");
    const [me, setMe] = useState<string>("");
    const [getRef, setRef] = useDynamicRefs();
    const history = useHistory();
    const myVideo = useRef<HTMLVideoElement>(null);
    const [peers, dispatch] = useReducer(reducer, {});

    useEffect(() => {
        socket.on("signal", (data) => {
            peers[data.socket_id]?.peer.signal(data.signal);
        });
        return () => {
            socket.off("signal");
        };
    }, [peers]);

    useEffect(() => {
        socket.on("me", (socket_id) => {
            setMe(socket_id);
        });

        socket.on("initReceive", (socket_id) => {
            console.log("INIT RECEIVE " + socket_id);
            addPeer(socket_id, false);
            socket.emit("initSend", socket_id);
        });

        socket.on("initSend", (socket_id) => {
            console.log("INIT SEND " + socket_id);
            addPeer(socket_id, true);
        });

        socket.on("disconnected", (socket_id) => {
            console.log("removing peer " + socket_id);
            removePeer(socket_id);
        });

        socket.on("disconnect", () => {
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
        startStream();
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
            console.log("peeer streeam");
            const video = getRef(
                socket_id
            ) as React.RefObject<HTMLVideoElement>;
            if (video.current) video.current.srcObject = stream;
        });

        dispatch(addPeerAction(socket_id, newPeer));
    };

    const removePeer = (socket_id: string) => {
        dispatch(deletePeerAction(socket_id));
    };

    const shareScreen = () => {
        const mediaDevices = navigator.mediaDevices as any;
        mediaDevices.getDisplayMedia({}).then((currentStream: MediaStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        });
    };

    const startStream = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                if (myVideo.current) {
                    console.log({ currentStream });
                    myVideo.current.srcObject = currentStream;
                }
            });
    };

    const joinRoom = async () => {
        await fetch("http://localhost:5000/join").then((res) => {
            res.json().then((r) => {
                history.push(`/room/${r.link}`);
                // startStream();
            });
        });
    };

    const addUserToRoom = (roomID: string) => {
        // startStream();

        socket.emit("join-room", {
            roomID,
        });
    };

    const leaveRoom = (roomID: string) => {
        socket.emit("disconnect", {
            userID: me,
            roomID,
        });
    };

    return (
        <SocketContext.Provider
            value={{
                myVideo,
                stream,
                name,
                peers,
                setName,
                shareScreen,
                joinRoom,
                setRef,
                addUserToRoom,
                leaveRoom,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
