import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { Auditpage } from "../Audit";
import { HomePage } from "../HomePage";
import { LoginPage } from "../LoginPage";
import { RegisterPage } from "../RegisterPage";
import { alertActions } from "../_actions";
import { PrivateRoute } from "../_components";
import { history } from "../_helpers";

class App extends React.Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      if (this && this.props && this.props.clearAlerts)
        this.props.clearAlerts();
    });
  }

  render() {
    const { alert } = this.props;
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-8 col-sm-offset-2">
            {alert.message && (
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            )}
            <Router history={history}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    let path = "/home";
                    if (user && user.role === "Auditor") {
                      path = "/audit";
                    }
                    console.log(
                      path,
                      window.location.href,
                      window.location.href.indexOf(path)
                    );
                    // if (window.location.href.indexOf(path) !== -1)
                    return <Redirect {...props} to={path} />;
                    return <Redirect {...props} to="/" />;
                  }}
                />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <PrivateRoute exact path="/audit" component={Auditpage} />
                <PrivateRoute exact path="/home" component={HomePage} />
              </Switch>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
