export interface IUserRole {
    Title: string,
    Id: string,
    Email: string,
    UsersRoles: { role: string, department: string }[]
}

export default class RoleUtilities {
    static userCanAccessAdminPage(user: IUserRole): boolean {
        return user.UsersRoles && user.UsersRoles.findIndex(userRole =>
            ["Admin", "Branch Chief", "Div Chief"].includes(userRole.role)) >= 0;
    }

    static getEditableRoles(user: IUserRole): string[] {
        let userRoles: string[] = user.UsersRoles.map(userRole => userRole.role);
        let editableRoles: string[] = [];
        if (userRoles.includes("Admin")) {
            editableRoles = ["Admin", "Branch Chief", "Div Chief", "Reviewer"];
        } else if (userRoles.includes("Branch Chief") || userRoles.includes("Div Chief")) {
            editableRoles = ["Reviewer"];
        }
        return editableRoles;
    }
}