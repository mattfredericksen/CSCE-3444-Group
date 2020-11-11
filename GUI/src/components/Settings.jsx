import React, { Component } from "react";

    const divStyle = {
        color: 'orange',
        textAlign: "center",
    };

class Settings extends Component{
    constructor(props) {
        super(props);
        this.state = { emailName: 'Enter new email'};
    }
    myChangeHandler = (event) => {
        this.setState({emailName: event.target.value});
    }
    state = { isOpen: false };

    render() {
        return(
            <form>
                <h1 style={divStyle}>
                    Settings
                </h1>
                <h4 style={divStyle}>
                    Change Email
                </h4>
                <h4 style={divStyle}>
                    Current Email:
                    <h5 style={divStyle}>
                        SomeOne@mail.com
                    </h5>
                </h4>
                <h4 style={divStyle}>
                    New Email:
                    <input
                        type="text"
                        onChange={this.myChangeHandler}
                    />
                </h4>
                <h4 style={divStyle}>
                    New Email
                    <h4 style={divStyle}>
                        {this.state.emailName}
                    </h4>
                </h4>
            </form>
        );
    }
}

export default Settings
