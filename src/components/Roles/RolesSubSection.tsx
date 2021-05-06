import * as React from 'react';
import { RoleForm } from "./RoleForm";
import { PersonaList } from "./PersonaList";
import { Card } from "react-bootstrap";
import { OrgsContext } from '../../providers/OrgsContext';

export interface IRolesSubSection {
	roleType: string
}

export const RolesSubSection: React.FunctionComponent<IRolesSubSection> = ({ roleType }) => {

	const { orgs } = React.useContext(OrgsContext);
	
	return (
		<Card>
			<Card.Header>WAR {roleType}s</Card.Header>
			<Card.Body>
				<Card.Title>
					<RoleForm roleType={roleType} orgs={orgs ? orgs : []} />
				</Card.Title>
				<PersonaList roleType={roleType} />
			</Card.Body>
		</Card>
	);
}