import { IRole, IRolesApi } from "./RolesApi";
import { TestImages } from '@uifabric/example-data';

export default class RolesApiDev implements IRolesApi {
	roles: IRole[] = [
		{
			ItemID: 1,
			RoleName: 'Admin',
			imageUrl: TestImages.personaFemale,
			imageInitials: 'AL',
			text: 'Annie Lindqvist'			
		},
		{
			ItemID: 2,
			RoleName: 'Reviewer',
			imageUrl: TestImages.personaMale,
			imageInitials: 'JS',
			text: 'John Smith',
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

	async addRole(role: IRole): Promise<any> {
		console.log("New role being added with ID " + this.nextId);
		role.ItemID = this.nextId++;
		return new Promise<IRole>((resolve, reject) => setTimeout(() => resolve(role), 1500));
	}

	async removeRole(roleId: number): Promise<any> {
		let filteredRoles = this.roles.filter(function (role) {
			return role.ItemID !== roleId;
		});
		await this.sleep(1500);
		this.roles = filteredRoles;
	}
}