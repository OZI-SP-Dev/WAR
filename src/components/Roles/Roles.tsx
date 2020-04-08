import * as React from 'react';
import { Row, Col, ListGroup, ListGroupItem, TabContent, TabPane, TabContainer } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { Admins } from "./Admins";
import RolesApi from "./RolesApi";

export const Roles: React.FunctionComponent = () => {
	//TODO: Check if admin role, redirect if not
	const [rolesList, setRolesList] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const rolesApi = new RolesApi();

	const getRoles = async () => {
		try {
			const newRoles = await rolesApi.fetchRoles();
			setRolesList(newRoles);
			setLoading(false);
			console.log(newRoles);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	React.useEffect(() => {
		getRoles().catch((error) => {
			console.log(error);
		})
	})

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
					{loading ? <h1>Loading</h1> : <>
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
					</>
					}
				</Col>
			</Row>
		</TabContainer>

	);
}