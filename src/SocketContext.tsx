import React, { useEffect, createContext, useState, useRef, FC } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext<null | any>(null);
const socket = io("http://localhost:5000");

type TCall = {
    isReceivedCall: Boolean;
    from: any;
    name: string;
    signal: any;
};

const ContextProvider: FC = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [me, setMe] = useState<string | null>(null);
    const [call, setCall] = useState<TCall>();
    const [name, setName] = useState<string>("");
    const [callAccepted, setCallAccepted] = useState<Boolean>(false);
    const [callEnded, setCallEnded] = useState<Boolean>(false);
    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });

        socket.on("me", (id) => setMe(id));
        socket.on("calluser", ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
    }, []);

    const shareScreen = () => {
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia({}).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        });
    };

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (data) => {
            console.log("cll from", call?.from);
            socket.emit("answercall", { signal: data, to: call?.from });
        });

        peer.on("stream", (currentStream) => {
            // @ts-ignore
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call?.signal);
        connectionRef.current = peer;
    };

    const callUser = (id: string) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (data) => {
            socket.emit("calluser", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on("stream", (currentStream) => {
            // @ts-ignore
            userVideo.current.srcObject = currentStream;
        });

        socket.on("callaccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };
    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current?.destroy();
        window.location.reload();
    };

    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                shareScreen,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
