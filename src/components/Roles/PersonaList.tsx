import React, { Dispatch, SetStateAction } from 'react';
import { IPersonaSharedProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';

export interface IPersonaList {
	personas: IPersonaSharedProps[],
	setPersonas: Dispatch<SetStateAction<IPersonaSharedProps[]>>
}

export const PersonaList: React.FunctionComponent<IPersonaList> = ({ personas, setPersonas }) => {
	function deleteAdmin(persona: IPersonaSharedProps): void {
		let array = personas.slice();
		const index = array.indexOf(persona);
		if (index > -1) {
			array.splice(index, 1);
			setPersonas(array);
		}
	}

	const deleteIcon: IIconProps = { iconName: 'Delete' };

	return (
		<Stack tokens={{ childrenGap: 10 }}>
			{personas.map((persona, index) => (
				<div key={persona.text}>
					<Persona className="float-left"
						{...persona}
					/>
					<ActionButton iconProps={deleteIcon} onClick={() => deleteAdmin(persona)} />
				</div>
			))}
		</Stack>
	);
};
