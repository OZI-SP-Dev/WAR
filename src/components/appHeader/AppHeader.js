import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './AppHeader.css';
import { UserContext } from '../../providers/UserProvider';

function AppHeader() {
  const user = useContext(UserContext);
  return (
    <Navbar fixed="top" expand="lg" variant="dark" bg="dark" className="p-0 shadow">
      <Navbar.Brand href="#home" className="col-sm-3 col-md-2 mr-0">Weekly Activity Report</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/Help" className="justify-content-end">
            <Nav.Link>Help</Nav.Link>
          </LinkContainer>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item>Action</NavDropdown.Item>
            <NavDropdown.Item>Another action</NavDropdown.Item>
            <NavDropdown.Item>Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mr-2">
            Welcome {user.data}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppHeader;
