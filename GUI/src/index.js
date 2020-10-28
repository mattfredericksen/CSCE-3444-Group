import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <App />
    </MuiPickersUtilsProvider>,
    document.getElementById("root")
);

serviceWorker.unregister();