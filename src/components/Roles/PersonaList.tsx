import React from 'react';
import { Persona } from 'office-ui-fabric-react/lib/Persona';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';
import { RolesApiConfig, IRole } from "./RolesApi";
import { RolesContext } from "./RolesContext";

export interface IPersonaList {
	roleType: string
}

export const PersonaList: React.FunctionComponent<IPersonaList> = ({ roleType }) => {

	const rolesContext = React.useContext(RolesContext);
	const { rolesList, setRolesList } = rolesContext;
	const rolesApi = RolesApiConfig.rolesApi;

	async function deleteRole(role: IRole): Promise<void> {
		if (rolesList && setRolesList !== undefined) {
			let array = [...rolesList];
			const index = array.indexOf(role);
			if (index > -1) {
				array.splice(index, 1);
				await rolesApi.removeRole(role.item.Id);
				setRolesList(array);
			}
		}
	}

	const deleteIcon: IIconProps = { iconName: 'Delete' };

	return (
		rolesList ? 
		<Stack tokens={{ childrenGap: 10 }}>
			{rolesList.map((role, index) => (
				role.item.roleName === roleType ? 
				<div key={role.item.Id}>
					<Persona className="float-left"
						{...role.persona}
					/>
					<ActionButton iconProps={deleteIcon} onClick={() => deleteRole(role)} />
				</div> : null
			))}
		</Stack> : <>No {roleType}s set</>
	);
};
