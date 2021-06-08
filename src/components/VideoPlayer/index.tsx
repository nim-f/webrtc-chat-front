import React, { FC, useContext, LegacyRef, forwardRef } from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
        margin: "10px",
    },
}));

export const VideoPlayer: FC<{
    name: string;
    videoRef: LegacyRef<HTMLVideoElement>;
    isMuted: boolean;
}> = ({ name, videoRef, isMuted }) => {
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
                <Typography variant="h5">{name || "Name"}</Typography>
                <video
                    playsInline
                    ref={videoRef}
                    autoPlay
                    className={classes.video}
                    muted={isMuted}
                />
            </Grid>
        </Paper>
    );
};
