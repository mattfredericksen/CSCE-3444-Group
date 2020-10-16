import React, { Component } from "react";
import logo from "./global-warming.svg";

class Header extends Component {
  state = { isOpen: false };

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const openDropdown = `dropdown-menu${this.state.isOpen ? " show" : ""}`;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <style>{"body {background-color:#2C2F33}"}</style>
          <style>{"nav {background-color:#7289DA"}</style>
          <style>{"p {color:white}"}</style>
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
            loading="lazy"
          ></img>
          <a className="navbar-brand">
            <strong>Temperature Checker</strong>
          </a>

          <div>
            <button className="btn btn-primary m-2" href="#">
              Home
            </button>
          </div>

          <div className="dropdown" onClick={this.toggleOpen}>
            <button
              type="button"
              className="btn btn-primary m-2 dropdown-toggle"
              data-toggle="dropdown"
            >
              View
            </button>
            <div className={openDropdown} aria-labelledby="dropdownButton">
              <a className="dropdown-item" href="#">
                Historical View
              </a>
              <a className="dropdown-item" href="#">
                Live View
              </a>
            </div>
          </div>

          <div>
            <button className="btn btn-primary m-2" href="#">
              Settings
            </button>
          </div>
        </nav>

        <p className="fixed-bottom">
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
    );
  }
}

export default Header;
