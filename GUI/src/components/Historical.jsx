import React, { Component } from "react";
import moment from "moment";
import { fetchRangeAggregates, oldestSample } from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Container, Grid, Paper, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import ListGroup from "react-bootstrap/ListGroup";


class Historical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            minDate: moment(),
            startDate: moment(),
            endDate: moment(),
            metrics: {},
            alert: {message: "", severity: "error"},
        };

        this.update = this.update.bind(this);
        this.updateMetric = this.updateMetric.bind(this);
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
        const { startDate, endDate } = this.state;
        console.log(`update: \n\t${startDate} \n\t${endDate}`);

        if (startDate.isSameOrAfter(endDate)) {
            this.setAlert("Start date must be earlier than end date");
            return;
        } else if (this.state.alert) {
            // clear previous alert
            this.setAlert();
        }

        // Values returned are promises. Set each promise
        // to update state when they resolve.
        const metrics = fetchRangeAggregates(startDate, endDate);
        for (const name in metrics) {
            metrics[name]
                .then(value => this.updateMetric(name, value))
                .catch(e => {
                    this.updateMetric(name, "error");
                    this.setAlert(e.message);
                });
        }
    }

    updateMetric(name, value) {
        // This function ensures that rapid state changes
        // are processed correctly.
        const { metrics } = this.state;

        this.setState({metrics: {...metrics, [name]: value}},
            () => console.log("metrics update: ", this.state.metrics));
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
        const { minDate, startDate, endDate, metrics, alert } = this.state;

        return (
            <Container maxWidth={"md"}>
                <Grid container spacing={3} justify={'center'}>
                    <Grid item xs={8}>
                        <h3 style={{'text-align': 'center', 'color': 'white'}}>Historical</h3>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <Paper>
                            <DateTimePicker
                                value={startDate} fullWidth
                                onChange={this.setStartDate}
                                minDate={minDate} disableFuture={true} />
                        </Paper>
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <Paper>
                            <DateTimePicker
                                value={endDate} fullWidth
                                onChange={this.setEndDate}
                                minDate={minDate} disableFuture={true} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <ListGroup>
                            {Object.keys(metrics).map((name) =>
                                <ListGroup.Item key={name}>
                                    {name}: {metrics[name]}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
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