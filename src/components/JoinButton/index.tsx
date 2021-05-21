import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { SocketContext } from "../../SocketContext";

export const JoinButton = () => {
    const { joinRoom } = useContext(SocketContext);

    return (
        <Button variant="contained" color="primary" onClick={joinRoom}>
            Join the room
        </Button>
    );
};
