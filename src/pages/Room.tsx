import React, { useEffect, useContext } from "react";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { SocketContext, TPeer } from "../context/SocketContext";

export const Room = () => {
    const params = useParams<{ id: string }>();
    const { addUserToRoom, leaveRoom } = useContext(SocketContext);
    useEffect(() => {
        addUserToRoom(params.id);
        return () => {
            leaveRoom(params.id);
        };
    }, []);
    return (
        <div>
            <Typography>Room {params.id}</Typography>
            <VideoPlayer />
        </div>
    );
};
