import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { connect } from "react-redux";
import NavBar from "../Navbar";
import { userActions } from "../_actions";
import { prepareDate } from "../_helpers";
import "./Audit.css";
const UsersTable = ({ users, onDelete }) => {
  const [hoursFormat, setHoursFormat] = useState(12);
  if (!users.items) {
    return "No Users available";
  }
  const handleHoursFormatChange = (event) => {
    if (event && event.target && event.target.value !== hoursFormat) {
      setHoursFormat(event.target.value);
    }
  };
  return (
    <>
      <Form.Group controlId="date-format">
        <Form.Label>Date Time Format</Form.Label>
        <Form.Control
          as="select"
          custom
          defaultValue={hoursFormat}
          onChange={handleHoursFormatChange}
        >
          <option value={24}>24 Hours</option>
          <option value={12}>12 Hours</option>
        </Form.Control>
      </Form.Group>

      <Table striped bordered className="user-screen">
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
              <td>{prepareDate(user.createdDate, hoursFormat)}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                {user.deleting ? (
                  <em>Deleting...</em>
                ) : user.deleteError ? (
                  <span className="text-danger">ERROR: {user.deleteError}</span>
                ) : (
                  <span>
                    <a onClick={onDelete(user.id)}>Delete</a>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
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
