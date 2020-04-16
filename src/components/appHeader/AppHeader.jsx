import React, { useContext } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { UserContext } from '../../providers/UserProvider';
import './AppHeader.css';

function AppHeader() {
  const user = useContext(UserContext);
  return (
    <Navbar fixed="top" expand="lg" variant="dark" bg="dark" className="p-0 shadow">
      <Navbar.Brand className="col-sm-3 col-md-2 mr-0">Weekly Activity Report</Navbar.Brand>
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
            <LinkContainer to="/Activities">
              <NavDropdown.Item>Activities</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <LinkContainer to="/WAR">
              <NavDropdown.Item>WAR</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/BigRocks">
              <NavDropdown.Item>Big Rocks</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/HistoryReport">
              <NavDropdown.Item>History</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mr-2">
            Welcome {user.Title}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppHeader;
