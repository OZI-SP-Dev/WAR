import { IRole, IRolesApi } from "./RolesApi";
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from '@uifabric/example-data';

export default class RolesApiDev implements IRolesApi {
	roles: IRole[] = [
		{
			item: {
				Id: 1,
				roleName: 'Admin'
			},
			persona: {
				imageUrl: TestImages.personaFemale,
				imageInitials: 'AL',
				text: 'Annie Lindqvist',
				secondaryText: 'Software Engineer',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm'
			}
		},
		{
			item: {
				Id: 2,
				roleName: 'Reviewer'
			},
			persona: {
				imageUrl: TestImages.personaMale,
				imageInitials: 'JS',
				text: 'John Smith',
				secondaryText: 'Software Engineer',
				tertiaryText: 'In a meeting',
				optionalText: 'Available at 4:00pm',
			}
		}
	];

	nextId = 3;
	

	sleep(m: number) {
		return new Promise(r => setTimeout(r, m));
	}

	async fetchRoles(): Promise<any> {
		await this.sleep(1500);
		return this.roles;
	}

	async addRole(roleName: string, persona: IPersonaProps): Promise<any> {
		console.log("New role being added...");
		const newRole = {
			item: {
				Id: this.nextId++,
				roleName: roleName
			},
			persona: persona
		}
		await this.sleep(1500);
		return newRole;
	}

	async removeRole(roleId: number): Promise<any> {
		let filteredRoles = this.roles.filter(function (role) {
			return role.item.Id !== roleId;
		});
		await this.sleep(1500);
		this.roles = filteredRoles;
	}
}