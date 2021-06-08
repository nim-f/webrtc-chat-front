import React from "react";
import { useHistory } from "react-router-dom";

import { JoinButton } from "src/components/JoinButton";

export const Home = () => {
    const history = useHistory();

    const joinRoom = async () => {
        await fetch("https://webrtc-chat-app-ann.herokuapp.com/join").then(
            (res) => {
                res.json().then((r) => {
                    history.push(`/room/${r.link}`);
                });
            }
        );
    };
    return (
        <div>
            <JoinButton onClick={joinRoom} />
        </div>
    );
};
