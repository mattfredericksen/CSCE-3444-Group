import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {InputAdornment} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import React from "react";
import MomentUtils from "@date-io/moment";

export default function ConfiguredDateTimePicker(props) {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
                disableFuture fullWidth
                inputVariant={'outlined'} minutesStep={5}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EventIcon />
                        </InputAdornment>
                    ),
                }}
                {...props}
            />
        </MuiPickersUtilsProvider>
    );
}