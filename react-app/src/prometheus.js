import moment from "moment";

const api = "http://localhost:9090/api/v1/query?";

export function fetchMostRecent() {
    // this query currently gets all metrics from the
    // "sensors" job, where the `__name__` attribute
    // does not match regex `(python|scrape).*`, since
    // those are auto-generated by prometheus.
    return (
        fetch(api + 'query={job="sensors",__name__!~"(python|scrape).*"}')
            .then(res => res.json())
            .then(res => extractMetrics(res.data.result))
    );
}

// this function takes a response from a prometheus query
// and returns just the values we want.
export function extractMetrics(result) {
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

export function fetchRangeAggregates(startDate) {
    console.log(startDate);
    let result = (
        fetch(api + 'query=changes(is_on[1d])')
            .then(res => res.json())
            .then(res => res.data.result)
    );
    console.log(result);
}