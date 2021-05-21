import React from "react";

import { VideoPlayer } from "src/components/VideoPlayer";
import { Notifications } from "src/components/Notifications";
import { Options } from "src/components/Options";
import { JoinButton } from "src/components/JoinButton";

export const Home = () => {
    return (
        <div>
            <JoinButton />
            <VideoPlayer />
            <Options>
                <Notifications />
            </Options>
        </div>
    );
};
