// This module contains all relevant functions for
// querying data from the Prometheus database.

import moment from "moment";

const api = "http://localhost:9090/api/v1/query?";

export function fetchMostRecent() {
    // this query currently gets all metrics from the
    // "sensors" job, where the `__name__` attribute
    // does not match regex `(python|scrape).*`, since
    // those are auto-generated by prometheus.
    return (
        fetch(api + 'query={__name__!~"(scrape).*"}')
            .then(res => res.json())
            .then(res => extractLiveMetrics(res.data.result))
    );
}

// this function takes a response from a prometheus query
// and returns just the values we want.
function extractLiveMetrics(result) {
    console.log(result);
    let metrics = result.map(metric => {
        return ({'name': metric['metric']['__name__'],
                 'value': metric['value'][1]}
        );
    });

    // From our response, check the "up" metric, which tells
    // us if Prometheus is able to actively read from the sensors.
    let up_index;
    for (let i = 0; i < metrics.length; i++) {
        if (metrics[i]['name'] === "up") {
            up_index = i;
            break;
        }
    }

    if (metrics[up_index]['value'] !== "1") {
        throw new Error("Prometheus is unable to read sensors. Is the Flask app running?");
    }

    // we don't want to display this metric to the user
    delete metrics[up_index];
    return metrics;
}

export function getRangeOffset(startDate, endDate) {
    console.log("startDate: " + startDate.toString());
    console.log("endDate: " + endDate.toString());

    let range = endDate.diff(startDate, 'minutes');
    let offset = moment().diff(endDate, 'minutes');

    console.log(`range: ${range.toString()} minutes`);
    console.log(`offset: ${offset.toString()} minutes`);

    if (range <= 0) {
        throw new Error(`startDate must be earlier than endDate (range: ${range} minutes)`);
    }
    if (offset < 0) {
        throw new Error(`Cannot query the future (offset: ${offset} minutes)`);
    }

    return {
        'range': `${range}m`,
        'offset': `${offset}m`,
    }
}

function formatQuery(strings, range, offset) {
    let rangeStr = range > 0 ? `[${range}m]` : "";
    let offsetStr = offset > 0 ? ` offset ${offset}m` : "";

    return `${api}query=${strings[0]}${rangeStr}${strings[1]}${offsetStr}${strings[2]}`;
}

export function oldestSample() {
    // TODO: adjust resolution from 5m to 1d
    return (
        fetch(api + "query=scalar(min_over_time(timestamp(up)[5y:5m]))")
            .then(res => res.json())
            .then(res => moment.unix(res.data.result[1]))
    );
}

// This function is currently experimental and will be
// eventually used with the historical view.
// It will retrieve specific metrics over the time
// range from `startDate` to `endDate`.
export function fetchRangeAggregates(startDate, endDate) {
    // errors must be returned as promises since
    // fetches are asynchronous
    const {range, offset} = getRangeOffset(startDate, endDate);

    console.log("query: " + formatQuery`changes(is_on${range}${offset})`);
    let onOffCycles = (
        fetch(formatQuery`changes(is_on${range}${offset})`)
            .then(res => res.json())
            .then(res => res.data.result)
    );
    console.log(onOffCycles);

    let avgIncomingAirTemp;
    avgIncomingAirTemp = (
        fetch(formatQuery`avg_over_time(incoming_air${range}${offset})`)
            .then(res => res.json())
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.error);
                }
                return res.data.result[0].value[1];
            })
    );
    console.log(avgIncomingAirTemp);
    return avgIncomingAirTemp;
}