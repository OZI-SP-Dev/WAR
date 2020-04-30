import DateUtilities from "./DateUtilities";

export interface IUserRole {
    Title: string,
    Id: string,
    Email: string,
    UsersRoles: { role: string, department: string }[]
}

export default class RoleUtilities {

    static allRoles = ["Admin", "Branch Chief", "Div Chief", "Reviewer"];

    static userHasAnyRole(user: IUserRole): boolean {
        return user.UsersRoles.some((role) => this.allRoles.includes(role.role));
    }

    static userIsBranchChiefOrHigher(user: IUserRole, org?: string): boolean {
        return org === undefined ?
            user.UsersRoles.some(role => ["Admin", "Branch Chief", "Div Chief"].includes(role.role))
            : user.UsersRoles.some((role) =>
                role.role === "Admin" || (["Branch Chief", "Div Chief"].includes(role.role) && org.includes(role.department)));
    }

    static userCanAccessAdminPage(user: IUserRole): boolean {
        return this.userIsBranchChiefOrHigher(user);
    }

    static userCanSetBigRock(user: IUserRole, org: string): boolean {
        return this.userIsBranchChiefOrHigher(user, org);
    }

    static userCanSetHistory(user: IUserRole, org: string): boolean {
        return this.userIsBranchChiefOrHigher(user, org);
    }

    static getEditableRoles(user: IUserRole): string[] {
        let userRoles: string[] = user.UsersRoles.map(userRole => userRole.role);
        let editableRoles: string[] = [];
        if (userRoles.includes("Admin")) {
            editableRoles = this.allRoles;
        } else if (userRoles.includes("Branch Chief") || userRoles.includes("Div Chief")) {
            editableRoles = ["Reviewer"];
        }
        return editableRoles;
    }

    static getMinActivityCreateDate(user: IUserRole): Date {
        let weekStart = DateUtilities.getStartOfWeek(new Date());
        if (this.userHasAnyRole(user)) {
            weekStart.setDate(weekStart.getDate() - 7);
        }
        return weekStart;
    }
}