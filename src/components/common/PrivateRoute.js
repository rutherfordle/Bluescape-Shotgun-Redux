import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import store from "../../store";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (auth.isLoading) {
                return <h2 className="mt-2">Loading...</h2>;
            } else if (!localStorage.getItem("token")) {
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
