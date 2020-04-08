import { spWebContext } from '../../providers/SPWebContext';
import { IPersonaSharedProps } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from '@uifabric/example-data';

export interface IRolesApi {
	fetchRoles(): Promise<any>,
	addRole(roleName: string, userId: string): Promise<any>,
	removeRole(roleId: number): Promise<any> 
}

export interface IRole {
	item: any,
	persona: IPersonaSharedProps
}

export default class RolesApi implements IRolesApi {
	rolesList = spWebContext.lists.getByTitle("Roles");

	async fetchRoles(): Promise<any> {
		//const spRoles = await this.rolesList.items.fields.select("Title", "User/Title", "User/ID").expand("User").get();
		const spRoles = await this.rolesList.items.get();
		let roles: IRole[] = [];

		spRoles.map((role: { Title: string; }) => {
			
			const newPersona: IPersonaSharedProps = {
				imageUrl: TestImages.personaFemale,
				imageInitials: role.Title.substr(role.Title.indexOf(' ')+1, 1) + role.Title.substr(0, 1),
				text: role.Title
			}
			const completeRole = {
				item: role,
				persona: newPersona
			}
			roles.push(completeRole);
			return null
		});
		
		return roles;
	}

	addRole(roleName: string, userId: string): Promise<any> {
		return this.rolesList.items.add({Title: roleName, User: userId});
	}

	removeRole(roleId: number): Promise<any> {
		return this.rolesList.items.getById(roleId).delete();
	}
}