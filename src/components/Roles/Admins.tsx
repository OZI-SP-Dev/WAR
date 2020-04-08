import * as React from 'react';
import { RolePeoplePicker } from "./RolePeoplePicker";
import { PersonaList } from "./PersonaList";
import { Card } from "react-bootstrap";
import { IPersonaSharedProps, IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from '@uifabric/example-data';

export const Admins: React.FunctionComponent = () => {
	//TODO: Check if admin role, redirect if not
	const examplePersonas: IPersonaSharedProps[] = [
		{
			imageUrl: TestImages.personaFemale,
			imageInitials: 'AL',
			text: 'Annie Lindqvist',
			secondaryText: 'Software Engineer',
			tertiaryText: 'In a meeting',
			optionalText: 'Available at 4:00pm'
		},
		{
			imageUrl: TestImages.personaMale,
			imageInitials: 'JS',
			text: 'John Smith',
			secondaryText: 'Software Engineer',
			tertiaryText: 'In a meeting',
			optionalText: 'Available at 4:00pm',
		}
	];
	const [personas, setPersonas] = React.useState<IPersonaSharedProps[]>(examplePersonas);

	function addPersonas(newpersonas: IPersonaProps[]): void {
		let newPersonas = [...personas, ...newpersonas];
		setPersonas(newPersonas);
	}

	return (
		<Card>
			<Card.Header>WAR Admins</Card.Header>
			<Card.Body>
				<Card.Title>
					<RolePeoplePicker
						addPersonas={addPersonas}
					/>
				</Card.Title>
				<PersonaList
					personas={personas}
					setPersonas={setPersonas}
				/>
			</Card.Body>
		</Card>
	);
}