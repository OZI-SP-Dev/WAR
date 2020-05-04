import React from 'react';
import { Persona } from 'office-ui-fabric-react/lib/Persona';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { ActionButton, IIconProps } from 'office-ui-fabric-react';
import { RolesApiConfig, IRole } from "../../api/RolesApi";
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
			console.log("Deleting item: " + role.ItemID);
			if (role.ItemID) {
				await rolesApi.removeRole(role.ItemID);
			}
			console.log("Index of deleted item: " + index);
			if (index > -1) {
				array.splice(index, 1);
				setRolesList(array);
			}
		}
	}

	const deleteIcon: IIconProps = { iconName: 'Delete' };

	return (
		rolesList ?
			<Stack tokens={{ childrenGap: 10 }}>
				{rolesList.map((role, index) => (
					role.RoleName === roleType ?
						<div key={role.ItemID}>
							<Persona className="float-left"
								{...role}
							/>
							<ActionButton iconProps={deleteIcon} onClick={() => deleteRole(role)} />
						</div> : null
				))}
			</Stack> : <>No {roleType}s set</>
	);
};
