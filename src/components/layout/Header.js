import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const authLinks = (
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <span className="nav-item px-2">
              <strong>{localStorage.getItem('token') ? `Welcome ${localStorage.getItem('username')}` : ""}</strong>
            </span>
            <span className="nav-item px-2">
                <a onClick={this.props.logout} className="">
                    <strong>Logout</strong>
                </a>
            </span>
        </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <strong className="text-primary">Login</strong>
                    </Link>
                </li>
            </ul>
        );

        return (
            <div id="header">
            <nav className="navbar navbar-expand-sm navbar-light text-white bg-secondary fixed-top zindex-0">
                <div id="navbarTogglerDemo01">
                    <a className="navbar-brand text-white" href="#">
                        Shotgun
                    </a>
                </div>
                <div className="container">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logout }
)(Header);