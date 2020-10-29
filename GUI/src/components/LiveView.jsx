import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

import { fetchMostRecent, fetchRangeAggregates } from "./prometheus";


class LiveView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            metrics: [],
        };
    }

    componentDidMount() {
        // set this component to fetch newest values every 15 seconds.
        this.update();
        this.timerID = setInterval(
            () => this.update(),
            15000
        );
    }

    componentWillUnmount() {
        // stop polling the database when the component is unmounted.
        clearInterval(this.timerID);
    }

    update() {
        if (this.state.error) {
            this.setState({isLoaded: false});
        }

        // retrieve the most recent metrics in the
        // database and update the state with them.
        fetchMostRecent()
            .then(metrics => {
                  this.setState({
                        isLoaded: true,
                        error: null,
                        metrics: metrics,
                  });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  this.setState({
                    isLoaded: true,
                    error: error
                  });
                }
            )
    }

    render() {
        const { error, isLoaded, metrics, startDate, endDate } = this.state;
        if (error) {
            return (
                <div>
                  <p>Error: {error.message}</p>
                  <p>Is Prometheus running on <a href={"http://localhost:9090"}>http://localhost:9090</a>?</p>
                </div>
            );
        }
        else if (!isLoaded) {
            return (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
            );
        }
        else {
            return (
                <ListGroup>
                  {metrics.map(metric => (
                      <ListGroup.Item key={metric.name}>
                        {metric.name}: {metric.value}
                      </ListGroup.Item>
                  ))}
                </ListGroup>
          );
        }
    }
}

export default LiveView;
