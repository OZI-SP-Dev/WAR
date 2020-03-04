import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './AppHeader.css';
import { UserContext } from '../../UserProvider';

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
          <NavDropdown title="Reports" id="basic-nav-dropdown">
            <LinkContainer to="/MyItems">
              <NavDropdown.Item>My Items</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <NavDropdown.Item>WAR</NavDropdown.Item>
            <NavDropdown.Item>Big Rocks</NavDropdown.Item>
            <NavDropdown.Item>Annual History</NavDropdown.Item>
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
