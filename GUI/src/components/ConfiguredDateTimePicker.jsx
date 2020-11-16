import {DateTimePicker} from "@material-ui/pickers";
import {InputAdornment} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import React from "react";

export default function ConfiguredDateTimePicker(props) {
    return (
        <DateTimePicker
            disableFuture fullWidth inputVariant={'outlined'}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EventIcon />
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
}