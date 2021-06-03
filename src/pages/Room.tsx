import React, { useEffect, useContext } from "react";
import { Grid, makeStyles, Typography, Dialog } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { SocketContext } from "../context/SocketContext";
import { JoinButton } from "src/components/JoinButton";
import { Notifications } from "src/components/Notifications";
import { Options } from "src/components/Options";

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
}));
export const Room = () => {
    const classes = useStyles();
    const params = useParams<{ id: string }>();

    const { addUserToRoom, leaveRoom, name, myVideo, stream, peers, setRef } =
        useContext(SocketContext);
    const [open, setOpen] = React.useState(!name);

    useEffect(() => {
        if (name) addUserToRoom(params.id);
        return () => {
            leaveRoom();
        };
    }, []);

    const closeModal = () => {
        if (name) {
            addUserToRoom(params.id);
            setOpen(false);
        }
    };
    return (
        <div>
            <Dialog open={open}>
                <JoinButton onClick={closeModal} />
            </Dialog>
            <Typography>Room {params.id}</Typography>
            <Grid container className={classes.gridContainer}>
                {stream && <VideoPlayer name={name} videoRef={myVideo} />}
                {Object.keys(peers).map((peer: string) => (
                    <VideoPlayer
                        key={peer}
                        name={peers[peer].name}
                        videoRef={setRef(peer)}
                    />
                ))}
            </Grid>
            <Options>
                <Notifications />
            </Options>
        </div>
    );
};
