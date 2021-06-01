import React, { useContext } from "react";

import { JoinButton } from "src/components/JoinButton";
import { SocketContext } from "src/context/SocketContext";

export const Home = () => {
    const { joinRoom } = useContext(SocketContext);

    return (
        <div>
            <JoinButton onClick={joinRoom} />
        </div>
    );
};
