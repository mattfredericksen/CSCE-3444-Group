import React, { Component } from "react";

class Settings extends Component{
    state = { isOpen: false };

    render() {
        return(
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Settings
                </h3>
            </div>
        );
    }
}

export default Settings