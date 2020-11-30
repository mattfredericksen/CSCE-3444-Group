import React, { Component } from "react";

const divStyle = {
    color: '#ffffff',
    textAlign: "center",
};

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            email: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        alert("You are submitting "+ this.state.fname + " with email " + this.state.email);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    render() {
        return (
            <form style={divStyle} onSubmit={this.mySubmitHandler}>
                <h3 style={divStyle}>
                    Please enter name and email address to add.
                </h3>
                <input type="text" name="fname" placeholder="Enter Name" onChange={this.handleChange}/>
                <br />
                <input type="text" name="email" placeholder="Enter Email" onChange={this.handleChange}/>
                <br />
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}
export default Settings

