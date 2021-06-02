import React, {
    useEffect,
    createContext,
    useState,
    useRef,
    FC,
    useReducer,
} from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useHistory } from "react-router-dom";
import useDynamicRefs from "use-dynamic-refs";
import { addPeerAction, deletePeerAction } from "src/actions/peerActions";
import { reducer } from "./reducer";

const SocketContext = createContext<null | any>(null);
const socket = io("http://localhost:5000");

const ContextProvider: FC = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [name, setName] = useState<string>("");
    const [me, setMe] = useState<Peer>();
    const [getRef, setRef] = useDynamicRefs();
    const history = useHistory();
    const myVideo = useRef<HTMLVideoElement>(null);
    const [peers, dispatch] = useReducer(reducer, {});

    console.log({ peers });

    useEffect(() => {
        socket.on("disconnected", (userId) => {
            console.log(`user ${userId} disconnected`);
            removePeer(userId);
        });
        return () => {
            socket.emit("disconnect");
        };
    }, []);

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

    const addUserToRoom = (roomID: string) => {
        const myPeer = new Peer();
        setMe(myPeer);

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myPeer.on("open", (id) => {
                    socket.emit("join-room", roomID, id); //emitting this to server to catch 'join-room'
                });
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                // answer to connected user and send him stream
                myPeer.on("call", (call) => {
                    call.answer(currentStream);
                    call.on("stream", (userVideoStream) => {
                        addVideoStream(call.peer, userVideoStream);
                    });
                });

                // get stream when new user get connected
                socket.on("user-connected", (userId) => {
                    const call = myPeer.call(userId, currentStream);
                    call.on("stream", (userVideoStream: MediaStream) => {
                        addVideoStream(userId, userVideoStream);
                    });
                });
            });
    };

    const addVideoStream = (userId: string, stream: MediaStream) => {
        dispatch(addPeerAction(userId, stream));
        const video = getRef(userId) as React.RefObject<HTMLVideoElement>;
        if (video.current) video.current.srcObject = stream;
    };

    const joinRoom = async () => {
        await fetch("http://localhost:5000/join").then((res) => {
            res.json().then((r) => {
                history.push(`/room/${r.link}`);
            });
        });
    };

    const leaveRoom = (roomID: string) => {
        socket.emit("disconnect");
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
