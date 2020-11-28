import {FormControlLabel, Grid, Switch} from "@material-ui/core";
import DateTimePicker from "./ConfiguredDateTimePicker";
import {LengthOfTimeInput, UnitOfTimeSelect} from "./InputFields";
import React, {useEffect, useState} from "react";
import {oldestSample} from "./prometheus";
import moment from "moment";


function useStateWithEvent(initialState, attribute='value') {
    const [state, setState] = useState(initialState);
    return [state, (event) => setState(event.target[attribute])];
}

export default function HvacInputGrid(props) {
    const {onChange, setAlert, startDate, endDate} = props;

    useEffect(() => {
        if (startDate.isSameOrAfter(endDate)) {
            setAlert("Start date must be earlier than end date", "info");
        } else if (endDate.isAfter(moment())) {
            setAlert("Cannot query the future");
        }
    }, [startDate, endDate, setAlert]);


    // minimum date retrieval only occurs once
    const [minDate, setMinDate] = useState(moment());
    useEffect(() => {
        oldestSample()
            .then(setMinDate)
            .catch(e => setAlert("Unable to retrieve oldest sample", "warning"));
    }, [setAlert]);

    const [enabled, setEnabled] = useStateWithEvent(false, 'checked');
    const [resolution, setResolution] = useStateWithEvent('1');
    const [resUnit, setResUnit] = useStateWithEvent('day');
    const [duration, setDuration] = useStateWithEvent('1');
    const [durUnit, setDurUnit] = useStateWithEvent('day');

    useEffect(() => {
        onChange({
            resolution: (enabled ?
                `${moment.duration(resolution, resUnit).asDays()}d` : null
            ),
            duration: (enabled ?
                `${moment.duration(duration, durUnit).asDays()}d` : null
            )
        });
    }, [enabled, resolution, resUnit, duration, durUnit, onChange]);

    return (
        <>
        <Grid item xs={9} sm={6}>
            <DateTimePicker
                label={"Start Date"} value={startDate} minDate={minDate}
                onChange={d => onChange({startDate: d})}
            />
        </Grid>
        <Grid item xs={9} sm={6}>
            <DateTimePicker
                label={"End Date"} value={endDate} minDate={minDate}
                onChange={d => onChange({endDate: d})}
            />
        </Grid>

        <Grid container item xs={10} sm={3} justify={'center'} alignItems={'center'}>
            <FormControlLabel
                control={
                    <Switch color="primary" onChange={setEnabled}/>
                }
                label={
                    <span style={{fontSize: "12px"}}>
                        {"Enable Range Query"}
                    </span>
                }
                labelPlacement="top"
            />
        </Grid>

        <Grid container item xs={12} sm={9} spacing={2} justify={'center'}>
            <Grid item xs={5} sm={3}>
                <LengthOfTimeInput
                    label={"Repeat every"} disabled={!enabled}
                    value={resolution} onChange={setResolution}
                />
            </Grid>
            <Grid item xs={5} sm={3}>
                <UnitOfTimeSelect
                    value={resUnit} plural={resolution !== '1'}
                    onChange={setResUnit} disabled={!enabled}
                />
            </Grid>
            <Grid item xs={5} sm={3}>
                <LengthOfTimeInput
                    label={"For the last"} disabled={!enabled}
                    value={duration} onChange={setDuration}
                />
            </Grid>
            <Grid item xs={5} sm={3}>
                <UnitOfTimeSelect
                    value={durUnit} plural={duration !== '1'}
                    onChange={setDurUnit} disabled={!enabled}
                />
            </Grid>
        </Grid>
        </>
    );
}