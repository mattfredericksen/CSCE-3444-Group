import React, { Component } from "react";
import moment from "moment";
import { fetchRangeAggregates, oldestSample } from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Snackbar from "@material-ui/core/Snackbar";
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

    setAlert(message = "", severity = "error") {
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
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Historical
                </h3>

                <DateTimePicker
                    value={startDate}
                    onChange={this.setStartDate}
                    minDate={minDate} disableFuture={true} />
                <DateTimePicker
                    value={endDate}
                    onChange={this.setEndDate}
                    minDate={minDate} disableFuture={true} />

                <ListGroup>
                    {Object.keys(metrics).map((name) =>
                        <ListGroup.Item key={name}>
                            {name}: {metrics[name]}
                        </ListGroup.Item>
                    )}
                </ListGroup>

                <Snackbar open={alert.message} onClose={this.closeAlert}>
                    <Alert severity={alert.severity} onClose={this.closeAlert}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default Historical