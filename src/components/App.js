import React, { Component, Fragment } from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./layout/Header";
import SideBar from "./project/sidebar";
import Project from "./project/Project";
import Playlist from "./project/Playlist";
import PrivateRoute from "./common/PrivateRoute";
import {connect} from "react-redux";
import {Login} from "./accounts/Login";
import { loadUser } from "../actions/auth";
import store from "../store";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./layout/Alerts";

const alertOptions = {
    timeout: 3000,
    position: "bottom center",
    offset: '30px'
};

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }
    render() {
        let sidebar = this.props.isAuthenticated? <SideBar pageWrapId={"page-wrap"} />: ''
        return (
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <Router>
                    <Fragment>
                        <Header />
                        <div id="outer-container">
                            {sidebar}
                            <main id="page-wrap">
                                <div class="container vh-100 bg-light col-md-8">
                                    <Switch>
                                        <PrivateRoute exact path="/" component={Project} />
                                        <PrivateRoute exact path="/playlist" component={Playlist} />
                                        <Route exact path="/login" component={Login} />
                                    </Switch>
                                </div>
                            </main>
                        </div>
                        <Alerts />
                    </Fragment>
                </Router>
            </AlertProvider>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
)(App);