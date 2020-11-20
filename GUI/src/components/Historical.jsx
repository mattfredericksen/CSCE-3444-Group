import React, {Component} from "react";
import moment from "moment";
import DateTimePicker from "./ConfiguredDateTimePicker";
import {Container, Grid, Snackbar} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import {oldestSample} from "./prometheus";
import HvacDataGrid from "./HvacDataGrid";
import {LengthOfTimeInput, UnitOfTimeSelect} from "./InputFields";

class Historical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minDate: moment(),
            startDate: moment(),
            endDate: moment(),
            repeat: {
                disabled: false,
                duration: '1', durUnit: 'day',
                resolution: '1', resUnit: 'day',
            },
            repeatParams: {duration: null, resolution: null},
            alert: {message: "", severity: "error"},
        };

        this.update = this.update.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.setRepeatParams = this.setRepeatParams.bind(this);

        // set the earliest date available to the date-pickers
        oldestSample()
            .then(res => this.setState({minDate: res}))
            .catch(e => this.setAlert("Unable to retrieve oldest sample", "warning"));
    }

    setAlert(message="", severity="error") {
        // call with no arguments to remove alert

        this.setState({
            alert: {
                severity: severity,
                message: message
            }
        });
    }

    update() {
        const { startDate, endDate, alert } = this.state;
        console.log(`update: \n\t${startDate} \n\t${endDate}`);

        if (startDate.isSameOrAfter(endDate)) {
            this.setAlert("Start date must be earlier than end date");
        } else if (endDate.isAfter(moment())) {
            this.setAlert("Cannot query the future");
        } else if (alert.message) {
            this.setAlert();
        }
    }

    setStartDate(date) {
        this.setState({startDate: date}, this.update);
    }

    setEndDate(date) {
        this.setState({endDate: date}, this.update);
    }

    closeAlert(event, reason) {
        if (reason !== 'clickaway') this.setAlert();
    }

    setRepeat(id, event) {
        const { repeat } = this.state;
        this.setState({repeat: {...repeat, [id]: event.target.value}},
            this.setRepeatParams);
    }

    setRepeatParams() {
        const { disabled, duration, durUnit, resolution, resUnit } = this.state.repeat;
        let params;

        if (disabled) {
            params = {duration: null, resolution: null};
        } else {
            const dur = moment.duration(duration, durUnit);
            const res = moment.duration(resolution, resUnit);
            params = {
                duration: `${dur.asDays()}d`,
                resolution: `${res.asDays()}d`
            }
        }
        this.setState({repeatParams: params});
    }


    render() {
        const { minDate, startDate, endDate, repeat, repeatParams, alert } = this.state;

        return (
            <Container maxWidth={"md"}>
                <Grid container spacing={2} justify={'center'}>
                    <Grid item xs={8}>
                        <h3 style={{textAlign: 'center', color: 'white'}}>Historical</h3>
                    </Grid>

                    <Grid item xs={9} sm={6}>
                        <DateTimePicker
                            label={"Start Date"} value={startDate}
                            onChange={this.setStartDate} minDate={minDate}
                        />
                    </Grid>
                    <Grid item xs={9} sm={6}>
                        <DateTimePicker
                            label={"End Date"} value={endDate}
                            onChange={this.setEndDate} minDate={minDate}
                        />
                    </Grid>

                    <Grid item xs={5} sm={3}>
                        <LengthOfTimeInput
                            label={"Repeat every"}
                            onChange={this.setRepeat.bind(this, 'resolution')}
                        />
                    </Grid>
                    <Grid item xs={5} sm={3}>
                        <UnitOfTimeSelect
                            onChange={this.setRepeat.bind(this, 'resUnit')}
                            value={repeat.resUnit} plural={repeat.resolution !== '1'}/>
                    </Grid>
                    <Grid item xs={5} sm={3}>
                    <LengthOfTimeInput
                        label={"For the last"}
                        onChange={this.setRepeat.bind(this, 'duration')}
                    />
                    </Grid>
                    <Grid item xs={5} sm={3}>
                        <UnitOfTimeSelect
                            onChange={this.setRepeat.bind(this, 'durUnit')}
                            value={repeat.durUnit} plural={repeat.duration !== '1'}/>
                    </Grid>

                    <Grid item xs={12}>
                        <HvacDataGrid
                            startDate={startDate} endDate={endDate}
                            errorCallback={this.setAlert} {...repeatParams}
                        />
                    </Grid>
                </Grid>

                <Snackbar open={Boolean(alert.message)}>
                    <Alert severity={alert.severity} onClose={this.closeAlert} variant={'filled'}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

export default Historical