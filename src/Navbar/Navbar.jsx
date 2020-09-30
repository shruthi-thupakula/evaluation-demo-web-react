import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
const NavBarComponent = (props) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand></Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link>
          <Link to="/home">Home</Link>
        </Nav.Link>
        <Nav.Link>
          {" "}
          <Link to="/audit">Auditor</Link>
        </Nav.Link>
        <Nav.Link>
          <Link to="/login">Logout</Link>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};
export default NavBarComponent;
