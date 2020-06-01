import * as React from 'react';
import { Row, Col, ListGroup, ListGroupItem, TabContent, TabPane, TabContainer } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { RolesSubSection } from "./RolesSubSection";
import { RolesContext } from "./RolesContext";
import RoleUtilities, { IUserRole } from '../../utilities/RoleUtilities';
import { OrgsApiConfig, IOrgs } from '../../api/OrgsApi';
import { useEffect, useState } from 'react';

export interface IRolesProps {
	user: IUserRole
}

export const Roles: React.FunctionComponent<IRolesProps> = ({ user }) => {
	//TODO: Only display items if they belong to roles TBD
	const rolesContext = React.useContext(RolesContext);
	const { loading } = rolesContext;
	const roles = RoleUtilities.getEditableRoles(user);
	const [orgs, setOrgs] = useState<IOrgs[]>([]);
	const orgsApi = OrgsApiConfig.orgsApi;

	const fetchOrgs = async () => {
		const fetchedOrgs = await orgsApi.fetchOrgs();
		setOrgs(fetchedOrgs ? fetchedOrgs : []);
	}

	useEffect(() => {
		fetchOrgs();
		// eslint-disable-next-line
	}, []);

	return (
		<TabContainer id="role-list" defaultActiveKey={"#/RoleManagement/" + roles[0]}>
			<Row>
				<Col xs="auto">
					<ListGroup>
						{roles.map((role) => (
							<LinkContainer key={role} to={"/RoleManagement/" + role}>
								<ListGroupItem action>
									{role}s
								</ListGroupItem>
							</LinkContainer>
						))}
					</ListGroup>
				</Col>
				<Col>
					{loading ? <h1>Loading...</h1> : <>
						{roles.map((role) => (
							<TabContent key={role}>
								<TabPane eventKey={"#/RoleManagement/" + role}>
									<RolesSubSection roleType={role} orgs={orgs.map(org => org.Title)} />
								</TabPane>
							</TabContent>
						))}
					</>
					}
				</Col>
			</Row>
		</TabContainer>
	);
}