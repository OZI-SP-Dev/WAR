import * as React from 'react';
import { RolePeoplePicker } from "./RolePeoplePicker";
import { PersonaList } from "./PersonaList";
import { Card } from "react-bootstrap";

export interface IRolesSubSection {
	roleType: string
}

export const RolesSubSection: React.FunctionComponent<IRolesSubSection> = ({ roleType }) => {
	return (
		<Card>
			<Card.Header>WAR {roleType}s</Card.Header>
			<Card.Body>
				<Card.Title>
					<RolePeoplePicker roleType={roleType} />
				</Card.Title>
				<PersonaList roleType={roleType} />
			</Card.Body>
		</Card>
	);
}