import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import React, { useContext, useState } from "react";
import {
  Button,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import RoleUtilities from "../../utilities/RoleUtilities";
import "./AppHeader.css";

function AppHeader() {
  const [query, setQuery] = useState("");

  let history = useHistory();

  const location = useLocation().pathname;
  // Prefills in WAR as the tool, and a debug text of "Current Route: {pathname}"
  const feedbackURL = `https://forms.osi.apps.mil/Pages/ResponsePage.aspx?id=jbExg4ct70ijX6yIGOv5tIAxYCOoNORIqIakY2dHNltUMVFaUUVFME9XQlc1S0UxWkNRNFdJUjhQWiQlQCN0PWcu&r5a32baccb51a4671852783b3f67af1aa=%22Weekly%20Activity%20Report%20(WAR)%22&r15b810f001d8426aace4f653c4846001=Current%20Route%3A%20${location}`;

  const user = useContext(UserContext);

  const updateQuery = (value) => {
    setQuery(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // the empty startDate/endDate indicates an open date range for the search
    history.push(`/Review?query=${query}&startDate=&endDate=`);
    setQuery("");
  };

  return (
    <Navbar
      fixed="top"
      expand="md"
      variant="dark"
      bg="dark"
      className="p-0 shadow"
    >
      <Navbar.Brand
        className={
          (process.env.REACT_APP_TEST_SYS ? "test " : "") +
          "col-xs-1 col-sm-3 col-md-2 mr-0"
        }
      >
        Weekly Activity Report
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer exact to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/:isReport(Activities|Review|WAR|MAR|HistoryReport)">
            <NavDropdown title="Reports" id="basic-nav-dropdown">
              <LinkContainer to="/Activities">
                <NavDropdown.Item>Activities</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/Review">
                <NavDropdown.Item>Review</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/WAR">
                <NavDropdown.Item>WAR</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/MAR">
                <NavDropdown.Item>MAR</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="HistoryReport">
                <NavDropdown.Item>History</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </LinkContainer>
          {
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip id="ContactUsNavTooltip">
                  Submit feedback, bug reports, or just say hello!
                </Tooltip>
              }
            >
              <button
                className="nav-link link-button"
                onClick={() => {
                  window.open(feedbackURL, "_blank");
                }}
              >
                Contact Us
              </button>
            </OverlayTrigger>
          }
          {RoleUtilities.userCanAccessAdminPage(user) && (
            <LinkContainer to="/RoleManagement">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>
          )}
          <LinkContainer className="d-lg-none d-xl-none" to="/Review">
            <Nav.Link>Search</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="justify-content-end">
          <Form
            className="d-none d-lg-inline-block"
            inline
            onSubmit={(e) => onSubmit(e)}
          >
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-1"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
            />
            <Button
              variant="outline-primary"
              className="mr-sm-3"
              onClick={(e) => onSubmit(e)}
            >
              Search
            </Button>
          </Form>
          <Persona
            className="mr-2 d-none d-md-inline-block"
            {...user.Persona}
            hidePersonaDetails
            size={PersonaSize.size32}
          />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppHeader;
