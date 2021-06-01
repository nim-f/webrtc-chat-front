import React, { useContext, FC } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import { SocketContext } from "src/context/SocketContext";

export const JoinButton: FC<{ onClick: () => void }> = ({ onClick }) => {
    const { name, setName } = useContext(SocketContext);
    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onClick();
    };

    return (
        <form onSubmit={onSubmit}>
            <FormGroup row>
                <TextField
                    inputProps={{
                        "data-testid": "name",
                    }}
                    label={"name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={onClick}>
                    Join the room
                </Button>
            </FormGroup>
        </form>
    );
};
