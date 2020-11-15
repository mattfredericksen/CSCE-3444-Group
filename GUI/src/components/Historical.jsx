import React, { Component } from "react";
import moment from "moment";
import { DateTimePicker } from '@material-ui/pickers';
import { Container, Grid, Snackbar, InputAdornment } from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';
import Alert from '@material-ui/lab/Alert';

import { oldestSample } from "./prometheus";
import HvacDataGrid from "./HvacDataGrid";


class Historical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            minDate: moment(),
            startDate: moment(),
            endDate: moment(),
            alert: {message: "", severity: "error"},
        };

        this.update = this.update.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.closeAlert = this.closeAlert.bind(this);

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

    render() {
        const { minDate, startDate, endDate, alert } = this.state;

        return (
            <Container maxWidth={"md"}>
                <Grid container spacing={3} justify={'center'}>
                    <Grid item xs={8}>
                        <h3 style={{textAlign: 'center', color: 'white'}}>Historical</h3>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <DateTimePicker
                            label={"Start Date"} value={startDate}
                            onChange={this.setStartDate}
                            minDate={minDate} disableFuture={true}
                            inputVariant={'outlined'} fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <DateTimePicker
                            label={"End Date"} value={endDate}
                            onChange={this.setEndDate}
                            minDate={minDate} disableFuture={true}
                            inputVariant={'outlined'} fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                    </Grid>
                    <Grid item xs={12}>
                        <HvacDataGrid startDate={startDate} endDate={endDate}/>
                    </Grid>
                </Grid>
                <Snackbar open={Boolean(alert.message)} onClose={this.closeAlert}>
                    <Alert severity={alert.severity} onClose={this.closeAlert} variant={'filled'}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

export default Historical