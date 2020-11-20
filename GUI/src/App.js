import React, {Component} from "react";
import MainPage from "./components/MainPage";
import LiveView from "./components/LiveView"
import Historical from "./components/Historical"
import Settings from "./components/Settings"
import "./App.css";
import logo from "./components/global-warming.svg";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

class App extends Component {
    state = { isOpen: false };

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    render()
    {
        const openDropdown = `dropdown-menu${this.state.isOpen ? " show" : ""}`;

        return(
            <Router>
                <Switch>
                    <div>
                        <div>
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <style>{"body {background-color:#969696}"}</style>
                                <style>{"nav {background-color:white"}</style>
                                <style>{"p {color:white}"}</style>
                                <img src={logo}
                                     width="30"
                                     height="30"
                                     className="d-inline-block align-top"
                                     alt=""
                                     loading="lazy">
                                </img>
                                <span className="navbar-brand">
                                    <strong>HVAC Monitor</strong>
                                </span>
                                <div>
                                    <Link to ='/'>
                                        <button className="btn m-2">
                                            Home
                                        </button>
                                    </Link>
                                </div>

                                <div className="dropdown" onClick={this.toggleOpen}>
                                    <button
                                        type="button"
                                        className="btn m-2 dropdown-toggle"
                                        data-toggle="dropdown"
                                    >
                                        View
                                    </button>
                                    <div className={openDropdown} aria-labelledby="dropdownButton">
                                        <Link to={'/Hist'}>
                                            <span className="dropdown-item">
                                                Historical View
                                            </span>
                                        </Link>
                                        <Link to={'Live'}>
                                            <span className="dropdown-item">
                                                Live View
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <Link to ='/Settings'>
                                        <button className="btn m-2">
                                            Settings
                                        </button>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                        <div>
                            <Route path="/" exact component={MainPage} />
                        </div>
                        <div>
                            <Route path="/Live" component={LiveView} />
                        </div>
                        <div>
                            <Route path="/Hist" component={Historical} />
                        </div>
                        <div>
                            <Route path="/Settings" component={Settings} />
                        </div>
                    </div>
                </Switch>
            </Router>
        );
  }
}
export default App;