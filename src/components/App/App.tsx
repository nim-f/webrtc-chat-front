import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, Link } from "react-router-dom";
import { Home } from "src/pages/Home";
import { Room } from "src/pages/Room";
import { createMemoryHistory } from "history";

const useStyles = makeStyles((theme) => ({
    appBar: {
        borderRadius: 15,
        margin: "30px 100px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "600px",
        border: "2px solid black",

        [theme.breakpoints.down("xs")]: {
            width: "90%",
        },
    },
    image: {
        marginLeft: "15px",
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
    },
}));

export const App = () => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <AppBar
                position="static"
                color="inherit"
                className={classes.appBar}
            >
                <Typography variant="h2" align="center">
                    Video chat
                </Typography>
            </AppBar>

            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/room/:id" exact component={Room} />
            </Switch>
        </div>
    );
};
