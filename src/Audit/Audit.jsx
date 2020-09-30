import React from "react";
import { connect } from "react-redux";
import NavBar from "../Navbar";
import { userActions } from "../_actions";
import "./Audit.css";
const UsersTable = ({ users, onDelete }) => {
  if (!users.items) {
    return "No Users available";
  }
  return (
    <table className="user-screen">
      <thead>
        <tr>
          <th>User Id</th>
          <th>Role</th>
          <th>CreatedDate</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.items.map((user, index) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.role}</td>
            <td>{user.createdDate}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>
              {user.deleting ? (
                <em> - Deleting...</em>
              ) : user.deleteError ? (
                <span className="text-danger">
                  {" "}
                  - ERROR: {user.deleteError}
                </span>
              ) : (
                <span>
                  <a onClick={onDelete(user.id)}>Delete</a>
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
class Auditpage extends React.Component {
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
        <NavBar />
        <div className="col-md-6 col-md-offset-3">
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All login audit :</h3>
          {users.loading && <em>Loading users...</em>}
          {users.error && (
            <span className="text-danger">ERROR: {users.error}</span>
          )}
          <UsersTable
            users={users}
            onDelete={this.handleDeleteUser.bind(this)}
          />
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

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
