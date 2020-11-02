import React, { Component } from "react";
import moment from "moment";
import {fetchRangeAggregates} from "./prometheus";
import {
    // DatePicker,
    // TimePicker,
    DateTimePicker,
    // MuiPickersUtilsProvider,
} from '@material-ui/pickers';

class Historical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            startDate: moment(),
            endDate: moment(),
            error: null,
        };
    }

    setStartDate(date) {
        // experimental function; check the console log
        this.setState({startDate: date});
        fetchRangeAggregates(date, this.state.endDate)
            .catch(e => {
                this.setState({error: e})
            });
    }

    setEndDate(date) {
        // experimental function; check the console log
        this.setState({endDate: date});
        fetchRangeAggregates(this.state.startDate, date)
            .catch(e => {
                this.setState({error: e})
            });
    }

    render() {
        const { isOpen, startDate, endDate, error } = this.state;
        return(
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Historical
                </h3>

                <DateTimePicker
                    value={startDate}
                    onChange={(d) => this.setStartDate(d)} />
                <DateTimePicker
                    value={endDate}
                    onChange={(d) => this.setEndDate(d)} />
            </div>
        );
    }
}

export default Historical