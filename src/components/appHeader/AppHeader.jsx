import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import React, { useContext, useState } from 'react';
import { Button, Form, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import DateUtilities from '../../utilities/DateUtilities';
import RoleUtilities from '../../utilities/RoleUtilities';
import { ContactUsContext } from '../ContactUs/ContactUsProvider';
import './AppHeader.css';

function AppHeader() {
  const [query, setQuery] = useState("");

  const user = useContext(UserContext);
  const history = useHistory();

  const updateQuery = (value) => {
    setQuery(value);
  }

  const handleSubmit = () => {
    history.push(`/Review${query !== "" ? "?query=" + query : ""}`);
    setQuery("");
  }

  let reviewStartDate = DateUtilities.getStartOfWeek();
  reviewStartDate.subtract(7, 'days');

  return (
    <Navbar fixed="top" expand="md" variant="dark" bg="dark" className="p-0 shadow">
			<Navbar.Brand className={(process.env.REACT_APP_TEST_SYS ? "test " : "") + "col-xs-1 col-sm-3 col-md-2 mr-0"}>Weekly Activity Report</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <NavDropdown title="Reports" id="basic-nav-dropdown">
            <LinkContainer to="/Activities">
              <NavDropdown.Item>Activities</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to={`/Review?startDate=${reviewStartDate.toISOString()}&endDate=${DateUtilities.getEndOfWeek().toISOString()}`}>
              <NavDropdown.Item>Review</NavDropdown.Item>
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
          <ContactUsContext.Consumer>
            {ContactUs => (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 500, hide: 0 }}
                overlay={
                  <Tooltip id="ContactUsNavTooltip">
                    Submit feedback, bug reports, or just say hello!
							    </Tooltip>
                }
              >
                <button className="nav-link link-button" onClick={() => { ContactUs.setShowContactUs(true) }}>
                  Contact Us
							</button>
              </OverlayTrigger>
            )}
          </ContactUsContext.Consumer>
          {RoleUtilities.userCanAccessAdminPage(user) &&
            <LinkContainer to="/RoleManagement">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>}
          <LinkContainer className="d-lg-none d-xl-none" to="/Review">
            <Nav.Link>Search</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="justify-content-end">
          <Form className="d-none d-lg-inline-block" inline onSubmit={handleSubmit}>
            <Form.Control type="text" placeholder="Search" className="mr-sm-1" value={query}
              onChange={(e) => updateQuery(e.target.value)}
            />
            <Button variant="outline-primary" className="mr-sm-3"
              onClick={handleSubmit} >
              Search
            </Button>
          </Form>
          <Persona className="mr-2 d-none d-md-inline-block" {...user.Persona} hidePersonaDetails size={PersonaSize.size32} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppHeader;
