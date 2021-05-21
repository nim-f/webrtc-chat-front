import React, { FC, useContext } from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext, TPeer } from "../../SocketContext";
import { PermMediaRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    video: {
        width: "550px",
        [theme.breakpoints.down("xs")]: {
            width: "300px",
        },
    },
    gridContainer: {
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    paper: {
        padding: "10px",
        border: "2px solid black",
        margin: "10px",
    },
}));

export const VideoPlayer: FC = () => {
    const {
        name,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        peers,
        setRef,
    } = useContext(SocketContext);
    const classes = useStyles();

    return (
        <Grid container className={classes.gridContainer}>
            {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">{name || "Name"}</Typography>
                        <video
                            playsInline
                            ref={myVideo}
                            autoPlay
                            className={classes.video}
                            muted
                        />
                    </Grid>
                </Paper>
            )}
            {Object.keys(peers).map((peer: string) => (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">{peer || "Name"}</Typography>
                        <video
                            playsInline
                            ref={setRef(peer)}
                            autoPlay
                            className={classes.video}
                        />
                    </Grid>
                </Paper>
            ))}
        </Grid>
    );
};
