import React, {Component} from "react";
import moment from "moment";
import {Container, Grid, Snackbar} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import HvacInputGrid from "./HvacInputGrid";
import HvacDataGrid from "./HvacDataGrid";

class Historical extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment(),
            resolution: "1d",
            duration: "1d",
            alert: {message: "", severity: "error"},
        };

        this.setState = this.setState.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
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

    closeAlert(event, reason) {
        if (reason !== 'clickaway') this.setAlert();
    }

    render() {
        const { startDate, endDate, resolution, duration, alert } = this.state;

        return (
            <Container maxWidth={"md"}>
                <Grid container spacing={2} justify={'center'} alignItems={'center'}>
                    <Grid item xs={8}>
                        <h3 style={{textAlign: 'center', color: 'white'}}>
                            {"Historical"}
                        </h3>
                    </Grid>

                    <HvacInputGrid
                        onChange={this.setState} setAlert={this.setAlert}
                        startDate={startDate} endDate={endDate}
                    />

                    <Grid item xs={12}>
                        <HvacDataGrid
                            startDate={startDate} endDate={endDate}
                            duration={duration} resolution={resolution}
                            setAlert={this.setAlert}
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