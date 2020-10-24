import React, { Component } from "react";
import MainPage from "./components/MainPage";
import LiveView from "./components/LiveView"
import Historical from "./components/Historical"
import Settings from "./components/Settings"
import "./App.css";
import logo from "./components/global-warming.svg";
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

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
                                <style>{"body {background-color:#2C2F33}"}</style>
                                <style>{"nav {background-color:white"}</style>
                                <style>{"p {color:white}"}</style>
                                <img src={logo}
                                     width="30"
                                     height="30"
                                     className="d-inline-block align-top"
                                     alt=""
                                     loading="lazy">

                                </img>
                                <a className="navbar-brand">
                                    <strong>Temperature Checker</strong>
                                </a>
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
                                        <Link to ='/Hist'>
                                            <a className="dropdown-item" href="#">
                                                Historical View
                                            </a>
                                        </Link>
                                        <Link to ='Live'>
                                            <a className="dropdown-item" href="#">
                                                Live View
                                            </a>
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

                            <p className="fixed-bottom m-2">
                                Icon made by{" "}
                                <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
                                    Freepik
                                </a>{" "}
                                from{" "}
                                <a href="https://www.flaticon.com/" title="Flaticon">
                                    {" "}
                                    www.flaticon.com
                                </a>
                            </p>
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