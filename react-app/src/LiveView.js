import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

class LiveView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    this.update();
    this.timerID = setInterval(
        () => this.update(),
        15000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  update() {
    fetch("http://localhost:5000/")
        .then(res => res.json())
        .then(
            (result) => {
              this.setState({
                isLoaded: true,
                sensors: result
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
        )
  }

  render() {
    const { error, isLoaded, sensors } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
      );
    } else {
      return (
          <ListGroup>
            {sensors.map(sensor => (
                // TODO: items need 'key' prop added
                <ListGroup.Item>
                  {sensor.name}: {sensor.value}
                </ListGroup.Item>
            ))}
          </ListGroup>
      );
    }
  }
}

export default LiveView;
