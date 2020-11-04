import React, { Component } from "react";
import moment from "moment";
import {fetchRangeAggregates, getRangeOffset, oldestSample } from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const theBeginning = (
    oldestSample()
        .catch(e => {
            console.error("Failed to retrieve oldestSample");
            return moment();
        })
);

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

    setStartDate(date) {
        console.log(this.state);
        // experimental function; check the console log
        this.setState({startDate: date});
        // fetchRangeAggregates(date, this.state.endDate)
        //     .catch(e => {
        //         this.setState({error: e})
        //     });
        getRangeOffset(date, this.state.endDate);
    }

    setEndDate(date) {
        // experimental function; check the console log
        this.setState({endDate: date});
        // fetchRangeAggregates(this.state.startDate, date)
        //     .catch(e => {
        //         this.setState({error: e})
        //     });
        getRangeOffset(this.state.startDate, date);
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