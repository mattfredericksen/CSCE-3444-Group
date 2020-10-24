import React, { Component } from "react";

class Historical extends Component{
    state = { isOpen: false };

    render() {
        return(
            <div>
                <style>{"h3 {color:white}"}</style>
                <h3 className="m-2">
                    Historical
                </h3>
            </div>
        );
    }
}

export default Historical