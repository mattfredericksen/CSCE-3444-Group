import {FormControlLabel, Grid, Switch} from "@material-ui/core";
import DateTimePicker from "./ConfiguredDateTimePicker";
import {LengthOfTimeInput, UnitOfTimeSelect} from "./InputFields";
import React, {useEffect, useState} from "react";
import {useStateWithEvent} from "./CustomHooks";
import {oldestSample} from "./prometheus";
import moment from "moment";


export default function HvacInputGrid(props) {
    const {onChange, setAlert} = props;

    const [startDate, setStartDate] = useState(moment);
    const [endDate, setEndDate] = useState(startDate);
    const [startErr, setStartErr] = useState(false);
    const [endErr, setEndErr] = useState(false);

    useEffect(() => {
        if (startDate.isSameOrAfter(endDate)) {
            setAlert("Start date must be earlier than end date");
            setStartErr(true);
        } else setStartErr(false);
        if (endDate.isAfter(moment())) {
            setAlert("Cannot query the future");
            setEndErr(true);
        } else setEndErr(false);
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
            range: (startDate.isBefore(endDate) ?
                moment.duration(endDate.diff(startDate)) : null
            ),
            offset: (endDate.isSameOrBefore(moment()) ?
                moment.duration(moment().diff(endDate)) : null
            ),
            resolution: (enabled ?
                moment.duration(resolution, resUnit) : null
            ),
            duration: (enabled ?
                moment.duration(duration, durUnit) : null
            )
        });
    }, [onChange, enabled, startDate, endDate,
        resolution, resUnit, duration, durUnit]);

    return (
        <>
        <Grid item xs={9} sm={6}>
            <DateTimePicker
                label={"Start Date"} value={startDate} minDate={minDate}
                onChange={setStartDate} error={startErr}
            />
        </Grid>
        <Grid item xs={9} sm={6}>
            <DateTimePicker
                label={"End Date"} value={endDate} minDate={minDate}
                onChange={setEndDate} error={endErr}
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