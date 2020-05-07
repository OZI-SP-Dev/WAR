import React, { useContext, useState } from 'react';
import { Button, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import RoleUtilities from '../../utilities/RoleUtilities';
import './AppHeader.css';
import RoleUtilities from '../../utilities/RoleUtilities';

function AppHeader() {
  const [query, setQuery] = useState(null);

  const user = useContext(UserContext);
  const history = useHistory();

  const updateQuery = (value) => {
    setQuery(value);
  }

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
          {RoleUtilities.userCanAccessAdminPage(user) &&
            <LinkContainer to="/RoleManagement">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>}
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Form inline>
            <Form.Control type="text" placeholder="Search" className="mr-sm-1" value={query}
              onChange={(e) => updateQuery(e.target.value)}
            />
            <Button variant="outline-primary" className="mr-sm-3"
              onClick={() => {
                if (query !== null) history.push(`/Review?query=${query}`)
              }} >Search</Button>
          </Form>
          <Navbar.Text className="mr-2">
            Welcome {user.Title}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppHeader;
