import React, { Component } from "react";
import moment from "moment";
import {fetchRangeAggregates, getRangeOffset, oldestSample } from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';


class Historical extends Component {
    constructor(props) {
        super(props);

        oldestSample()
            .then(res => this.setState({minDate: res}),
                  e => console.error("Failed to retrieve oldestSample")
        );

        this.state = {
            isOpen: false,
            minDate: moment(),
            startDate: moment(),
            endDate: moment(),
            error: null,
        };
    }

    update() {
        // experimental function; check the console log
        const { startDate, endDate } = this.state;
        console.log(`update: \n\t${startDate} \n\t${endDate}`);

        fetchRangeAggregates(startDate, endDate);
            // .catch(e => console.log(e.message));
    }

    setStartDate(date) {
        console.log(this.state);
        this.setState({startDate: date}, () => this.update());
    }

    setEndDate(date) {
        // experimental function; check the console log
        this.setState({endDate: date}, () => this.update());
    }

    render() {
        const { isOpen, minDate, startDate, endDate, error } = this.state;
        return(
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
            </div>
        );
    }
}

export default Historical