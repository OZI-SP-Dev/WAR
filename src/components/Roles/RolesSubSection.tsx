import * as React from 'react';
import { RolePeoplePicker } from "./RolePeoplePicker";
import { PersonaList } from "./PersonaList";
import { Card } from "react-bootstrap";

export interface IRolesSubSection {
	roleType: string,
	orgs: string[]
}

export const RolesSubSection: React.FunctionComponent<IRolesSubSection> = ({ roleType, orgs }) => {
	return (
		<Card>
			<Card.Header>WAR {roleType}s</Card.Header>
			<Card.Body>
				<Card.Title>
					<RolePeoplePicker roleType={roleType} orgs={orgs} />
				</Card.Title>
				<PersonaList roleType={roleType} />
			</Card.Body>
		</Card>
	);
}