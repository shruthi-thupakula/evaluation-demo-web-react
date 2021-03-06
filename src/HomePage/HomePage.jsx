import React from "react";
import { connect } from "react-redux";
import Navbar from "../Navbar";
import { userActions } from "../_actions";
import { history } from "../_helpers";
import "./Homepage.css";
class HomePage extends React.Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      if (this && this.props && this.props.clearAlerts)
        this.props.clearAlerts();
    });
  }

  componentDidMount() {
    this.props.getUsers();
  }

  handleDeleteUser(id) {
    return (e) => this.props.deleteUser(id);
  }

  render() {
    const { user, users } = this.props;
    return (
      <div>
        <Navbar />

        <div className="col-md-6 col-md-offset-3">
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All registered users:</h3>
          {users.loading && <em>Loading users...</em>}
          {users.error && (
            <span className="text-danger">ERROR: {users.error}</span>
          )}
          {users.items && (
            <ul>
              {users.items.map((user, index) => (
                <li key={user.id}>
                  {user.firstName + " " + user.lastName}
                  {user.deleting ? (
                    <em> - Deleting...</em>
                  ) : user.deleteError ? (
                    <span className="text-danger">
                      {" "}
                      - ERROR: {user.deleteError}
                    </span>
                  ) : (
                    <span>
                      {" "}
                      - <a onClick={this.handleDeleteUser(user.id)}>Delete</a>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p></p>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };
