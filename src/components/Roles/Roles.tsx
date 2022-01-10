import * as React from 'react';
import { Col, ListGroup, ListGroupItem, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import RoleUtilities, { IUserRole } from '../../utilities/RoleUtilities';
import { RolesContext } from "./RolesContext";
import { RolesSubSection } from "./RolesSubSection";
import { useHistory, useParams } from "react-router-dom";

export interface IRolesProps {
	user: IUserRole
}


type RoleParams = {
	role: string;
  };

export const Roles: React.FunctionComponent<IRolesProps> = ({ user }) => {
	//TODO: Only display items if they belong to roles TBD
	const rolesContext = React.useContext(RolesContext);
	const { loading } = rolesContext;
	const roles = RoleUtilities.getEditableRoles(user);
	const history = useHistory();
	let { role } = useParams<RoleParams>();

	//If no role is provided, or they provide an Invalid role
	// then redirect them to the first role in the listing
    if(!roles.includes(role)){
			let defaultRole = roles[0];
            history.push('/RoleManagement/' + defaultRole)
    }
    

	return (
		<TabContainer id="role-list" activeKey={role}>
			<Row>
				<Col xs="auto">
					<ListGroup>
						{roles.map((role) => (
							<LinkContainer to={"/RoleManagement/" + role}>
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
							<TabContent>
								<TabPane eventKey={role}>
									<RolesSubSection roleType={role} />
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