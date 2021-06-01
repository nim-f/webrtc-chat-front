import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, Link } from "react-router-dom";
import { Home } from "src/pages/Home";
import { Room } from "src/pages/Room";

const useStyles = makeStyles((theme) => ({
    appBar: {
        padding: "10px",
        marginBottom: "20px",
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
    title: {
        color: theme.palette.primary.main,
        textDecoration: "none",
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
                <Typography variant="h5" align="left">
                    <Link to={"/"} className={classes.title}>
                        Video chat
                    </Link>
                </Typography>
            </AppBar>

            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/room/:id" exact component={Room} />
            </Switch>
        </div>
    );
};
