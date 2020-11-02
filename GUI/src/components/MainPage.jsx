import React, { Component } from "react";

class MainPage extends Component{
    state = { isOpen: false };

    render() {
        return(
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Home
                </h3>
            </div>
        );
    }
}

export default MainPage