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
const socket = io("https://webrtc-chat-app-ann.herokuapp.com/");

const ContextProvider: FC = ({ children }) => {
    const history = useHistory();

    const [stream, setStream] = useState<MediaStream | undefined>();

    const [me, setMe] = useState<Peer>();
    const [myName, setMyName] = useState<string>("");
    const [isScreenSharing, setScreenSharing] = useState<boolean>(false);

    const [getRef, setRef] = useDynamicRefs();
    const myVideo = useRef<HTMLVideoElement>(null);

    const [peers, dispatch] = useReducer(reducer, {});

    useEffect(() => {
        socket.on("disconnected", (userID) => {
            console.log(`user ${userID} disconnected`);
            removePeer(userID);
        });
        return () => {
            leaveRoom();
        };
    }, []);

    useEffect(() => {
        if (!stream) return;
        if (!me) return;

        if (myVideo.current) {
            myVideo.current.srcObject = stream;
        }

        // answer to connected user and send him stream
        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
                addVideoStream(call.peer, userVideoStream, call.metadata.name);
            });
        });

        // get stream when new user get connected
        socket.on("user-connected", ({ userID, name }) => {
            const call = me.call(userID, stream, {
                metadata: { name: myName },
            });
            call.on("stream", (userVideoStream: MediaStream) => {
                addVideoStream(userID, userVideoStream, name);
            });
        });
    }, [stream, me]);

    const removePeer = (userID: string) => {
        dispatch(deletePeerAction(userID));
    };

    const switchScreen = () => {
        try {
            if (isScreenSharing) {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then(setMyStream)
                    .catch((err) => console.error(err));
            } else {
                const mediaDevices = navigator.mediaDevices as any;
                mediaDevices
                    .getDisplayMedia({})
                    .then(setMyStream)
                    .catch((err: any) => console.error(err));
            }

            setScreenSharing(!isScreenSharing);
        } catch (err) {
            console.error(err);
        }
    };

    const setMyStream = (currentStream: MediaStream) => {
        setStream(currentStream);

        if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
        }

        Object.keys(me?.connections).forEach((key: string) => {
            const videoTrack = currentStream
                .getTracks()
                .find((track) => track.kind === "video");
            me?.connections[key][0].peerConnection
                .getSenders()[1]
                .replaceTrack(videoTrack)
                .catch((err: any) => console.error(err));
        });
    };

    const addUserToRoom = (roomID: string) => {
        const myPeer = new Peer();
        setMe(myPeer);
        myPeer.on("open", (id) => {
            socket.emit("join-room", roomID, { id, name: myName }); //emitting this to server to catch 'join-room'
        });

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
            });
    };

    const addVideoStream = (
        userID: string,
        stream: MediaStream,
        name: string
    ) => {
        dispatch(addPeerAction(userID, stream, name));
        const video = getRef(userID) as React.RefObject<HTMLVideoElement>;
        if (video.current) video.current.srcObject = stream;
    };

    const leaveRoom = () => {
        socket.emit("user-disconnect");
        stream?.getTracks().forEach((track) => track.stop());
        history.push(`/`);
        setStream(undefined);
    };

    return (
        <SocketContext.Provider
            value={{
                myVideo,
                stream,
                myName,
                isScreenSharing,
                peers,
                setName: setMyName,
                switchScreen,
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
