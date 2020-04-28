import { spWebContext } from '../providers/SPWebContext';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import RolesApiDev from './RolesApiDev';
import "@pnp/sp/site-users/web";

export interface IRolesApi {
	fetchRoles(): Promise<any>,
	addRole(role: IRole): Promise<any>,
	removeRole(roleId: number): Promise<any>
}

export interface IRole extends IPersonaProps {
	RoleName?: string,
	AccountName?: string,
	Department?: string,
	Email?: string,
	SPUserId?: string,
	ItemID?: number
}

export default class RolesApi implements IRolesApi {
	rolesList = spWebContext.lists.getByTitle("Roles");

	async fetchRoles(): Promise<any> {
		//const spRoles = await this.rolesList.items.fields.select("ID", "Title", "User", "User/Title", "User/ID").expand("User").get();
		const spRoles = await this.rolesList.items.select("Id", "Title", "User/Title", "User/Id", "Department").expand("User").get();
		//const spRoles = await this.rolesList.items.get();
		let roles: IRole[] = spRoles.map((role: { Id: number, Title: string; User: { Title: string; Id: string; }, Department: string }) => {
			const newRole: IRole = {
				imageInitials: role.User.Title.substr(role.User.Title.indexOf(' ') + 1, 1) + role.User.Title.substr(0, 1),
				RoleName: role.Title,
				text: `${role.User.Title}${role.Department && role.Department !== null ? " for Department " + role.Department : ""}`,
				SPUserId: role.User.Id,
				ItemID: role.Id,
				Department: role.Department
			}
			return newRole;
		});

		return roles;
	}

	async addRole(role: IRole): Promise<any> {
		let ensuredUser = await spWebContext.ensureUser(role.Email);
		console.log(ensuredUser);
		role.SPUserId = ensuredUser.data.Id;
		// Let the Department field be null if it is for an Admin role, otherwise the roles should have a Department
		return this.rolesList.items.add({ Title: role.RoleName, UserId: role.SPUserId, Department: role.RoleName === "Admin" ? null : role.Department });
	}

	removeRole(roleId: number): Promise<any> {
		return this.rolesList.items.getById(roleId).delete();
	}
}

export class RolesApiConfig {
	static rolesApi: IRolesApi = process.env.NODE_ENV === 'development' ? new RolesApiDev() : new RolesApi();
}