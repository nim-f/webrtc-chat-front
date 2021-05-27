import React, { FC, useContext, useState } from "react";
import {
    Button,
    TextField,
    Grid,
    Typography,
    Container,
    Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    Assignment,
    Phone,
    PhoneDisabled,
    ScreenShare,
} from "@material-ui/icons";
import { SocketContext } from "../../context/SocketContext";
import { Notifications } from "../Notifications";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    gridContainer: {
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    container: {
        width: "600px",
        margin: "35px 0",
        padding: 0,
        [theme.breakpoints.down("xs")]: {
            width: "80%",
        },
    },
    margin: {
        marginTop: 20,
    },
    padding: {
        padding: 20,
    },
    paper: {
        padding: "10px 20px",
        border: "2px solid black",
    },
}));
export const Options: FC = ({ children }) => {
    const { me, name, setName, shareScreen } = useContext(SocketContext);

    const [idToCall, setIdToCal] = useState("");
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Account info
                            </Typography>
                            <TextField
                                label={"name"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <CopyToClipboard text={me}>
                                <Button
                                    className={classes.margin}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<Assignment fontSize="large" />}
                                >
                                    Copy your id
                                </Button>
                            </CopyToClipboard>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Make a call
                            </Typography>
                            <TextField
                                label={"Id to call"}
                                value={idToCall}
                                onChange={(e) => setIdToCal(e.target.value)}
                            />
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ScreenShare fontSize="large" />}
                                    fullWidth
                                    onClick={shareScreen}
                                    className={classes.margin}
                                >
                                    Share screen
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={
                                        <PhoneDisabled fontSize="large" />
                                    }
                                    fullWidth
                                    // onClick={leaveCall}
                                    className={classes.margin}
                                >
                                    Hang up
                                </Button>
                            </>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {children}
        </Container>
    );
};
