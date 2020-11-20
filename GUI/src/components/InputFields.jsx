import {MenuItem, TextField} from "@material-ui/core";
import React from "react";

const timeUnits = ["year", "month", "week", "day"];

export function UnitOfTimeSelect(props) {
    const { plural, ...childProps } = props;
    return (
        <TextField
            select fullWidth variant="outlined" margin={'dense'}
            {...childProps}
        >
            {timeUnits.map((option) => (
                <MenuItem key={option} value={option}>
                    {plural ? option + 's' : option}
                </MenuItem>
            ))}
        </TextField>
    );
}

export function LengthOfTimeInput(props) {
    return (
        <TextField
            type={'number'} margin={'dense'} fullWidth
            variant={"outlined"} defaultValue={1}
            inputProps={{min: 1, pattern: "[0-9]*"}} {...props}
        />
    );
}