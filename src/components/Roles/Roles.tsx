import * as React from 'react';
import { Row, Col, ListGroup, ListGroupItem, TabContent, TabPane, TabContainer } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { Admins } from "./Admins";

export const Roles: React.FunctionComponent = () => {
	//TODO: Check if admin role, redirect if not
	return (
		<TabContainer id="role-list" defaultActiveKey="#/RoleManagement/Admin">
			<Row>
				<Col xs="auto">
					<ListGroup>
						<LinkContainer to="/RoleManagement/Admin">
							<ListGroupItem action>
								Admins
							</ListGroupItem>
						</LinkContainer>
						<LinkContainer to="/RoleManagement/BranchChief">
							<ListGroupItem action>
								Branch Chiefs
							</ListGroupItem>
						</LinkContainer>
						<LinkContainer to="/RoleManagement/DivChief">
							<ListGroupItem action>
								Division Chiefs
							</ListGroupItem>
						</LinkContainer>
						<LinkContainer to="/RoleManagement/Reviewer">
							<ListGroupItem action>
								Reviewers
							</ListGroupItem>
						</LinkContainer>
					</ListGroup>
				</Col>
				<Col>
					<TabContent>
						<TabPane eventKey="#/RoleManagement/Admin">
							<Admins />
						</TabPane>
					</TabContent>
					<TabContent>
						<TabPane eventKey="#/RoleManagement/BranchChief">
							Branch chiefs...
						</TabPane>
					</TabContent>
					<TabContent>
						<TabPane eventKey="#/RoleManagement/DivChief">
							Division chiefs...
						</TabPane>
					</TabContent>
					<TabContent>
						<TabPane eventKey="#/RoleManagement/Reviewer">
							Reviewers...
						</TabPane>
					</TabContent>
				</Col>
			</Row>
			</TabContainer>

	);
}