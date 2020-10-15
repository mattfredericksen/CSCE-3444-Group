import React from 'react';

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
      return <div>Loading...</div>;
    } else {
      return (
          <ul>
            {sensors.map(sensor => (
                <li key={sensor.name}>
                  {sensor.name}: {sensor.value}
                </li>
            ))}
          </ul>
      );
    }
  }
}

export default LiveView;
