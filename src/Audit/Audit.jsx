import TablePagination from "@material-ui/core/TablePagination";
import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { connect } from "react-redux";
import NavBar from "../Navbar";
import { userActions } from "../_actions";
import { prepareDate } from "../_helpers";
import "./Audit.css";
import FilterForm, { filterUsers } from "./FilterForm";
// const filteredFreeData = data?.free.filter(doesTextExist(searchText));

const UsersTable = ({ users, onDelete }) => {
  const [localData, setLocalData] = useState([]);
  const [hoursFormat, setHoursFormat] = useState(12);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleHoursFormatChange = (event) => {
    if (event && event.target && event.target.value !== hoursFormat) {
      setHoursFormat(event.target.value);
    }
  };

  const handleSubmit = (data) => {
    setLocalData(filterUsers(data, localData));
  };

  const handleSetData = () => {
    if (users && users.items) {
      setLocalData(users.items);
    }
  };
  useEffect(() => {
    handleSetData();
  }, [users]);

  // if (!localData.length) {
  //   return "No Users available";
  // }
  return (
    <>
      <FilterForm onSubmit={handleSubmit} onClear={handleSetData} />
      <Form.Group as={Col}>
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
          {localData
            .slice(rowsPerPage * (page - 1), rowsPerPage * page)
            .map((user, index) => (
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
                    <span className="text-danger">
                      ERROR: {user.deleteError}
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
      </Table>{" "}
      <TablePagination
        component="div"
        count={localData.length}
        page={page}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
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
