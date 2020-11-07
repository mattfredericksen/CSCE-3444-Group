import React, { Component } from "react";
import moment from "moment";
import { fetchRangeAggregates, oldestSample } from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import ListGroup from "react-bootstrap/ListGroup";


class Historical extends Component {
    constructor(props) {
        super(props);

        // set the earliest date available to the date-pickers
        oldestSample()
            .then(res => this.setState({minDate: res}),
                  e => console.error("Failed to retrieve oldestSample")
        );

        this.state = {
            isOpen: false,
            minDate: moment(),
            startDate: moment(),
            endDate: moment(),
            metrics: {},
            error: null,
        };
    }

    update() {
        const { startDate, endDate } = this.state;
        console.log(`update: \n\t${startDate} \n\t${endDate}`);

        // Values returned are promises. Set each promise
        // to update state when they resolve.
        const metrics = fetchRangeAggregates(startDate, endDate);
        for (const name in metrics) {
            metrics[name].then(value => this.updateMetric(name, value));
        }
    }

    updateMetric(name, value) {
        // This function ensures that rapid state changes
        // are processed correctly.
        const { metrics } = this.state;
        this.setState({metrics: metrics},
            () => console.log("metrics update: ", this.state.metrics));
    }

    setStartDate(date) {
        this.setState({startDate: date}, () => this.update());
    }

    setEndDate(date) {
        this.setState({endDate: date}, () => this.update());
    }

    render() {
        const { minDate, startDate, endDate, metrics } = this.state;
        console.log(metrics);
        return (
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Historical
                </h3>

                <DateTimePicker
                    value={startDate}
                    onChange={(d) => this.setStartDate(d)}
                    minDate={minDate} disableFuture={true} />
                <DateTimePicker
                    value={endDate}
                    onChange={(d) => this.setEndDate(d)}
                    minDate={minDate} disableFuture={true} />
                <ListGroup>
                    {Object.keys(metrics).map((name) =>
                    <ListGroup.Item key={name}>
                        {name}: {metrics[name]}
                    </ListGroup.Item>
                    )}
                </ListGroup>
            </div>
        );
    }
}

export default Historical