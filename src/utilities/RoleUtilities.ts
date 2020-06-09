import { Moment } from "moment";
import { IActivity } from "../api/ActivitiesApi";
import { IUserPreferences } from "../api/UserPreferencesApi";
import DateUtilities from "./DateUtilities";

export interface IUserRole {
    Title: string,
    Id: string,
    Email: string,
    UsersRoles: { role: string, department: string }[],
    UserPreferences: IUserPreferences
}

export default class RoleUtilities {

    static ADMIN: string = "Admin";
    static BRANCH_CHIEF: string = "Branch Chief";
    static DIV_CHIEF: string = "Div Chief";
    static REVIEWER: string = "Reviewer";

    static allRoles = [RoleUtilities.ADMIN, RoleUtilities.BRANCH_CHIEF, RoleUtilities.DIV_CHIEF, RoleUtilities.REVIEWER];

    static userHasAnyRole(user: IUserRole): boolean {
        return user.UsersRoles.some((role) => this.allRoles.includes(role.role));
    }

    static userIsBranchChiefOrHigher(user: IUserRole, org?: string): boolean {
        return org === undefined ?
            user.UsersRoles.some(role =>
                [RoleUtilities.ADMIN, RoleUtilities.BRANCH_CHIEF, RoleUtilities.DIV_CHIEF].includes(role.role))
            : user.UsersRoles.some((role) =>
                role.role === RoleUtilities.ADMIN
                || ([RoleUtilities.BRANCH_CHIEF, RoleUtilities.DIV_CHIEF].includes(role.role)
                    && org.includes(role.department)));
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
        if (userRoles.includes(RoleUtilities.ADMIN)) {
            editableRoles = this.allRoles;
        } else if (userRoles.includes(RoleUtilities.BRANCH_CHIEF) || userRoles.includes(RoleUtilities.DIV_CHIEF)) {
            editableRoles = [RoleUtilities.REVIEWER];
        }
        return editableRoles;
    }

    static getMinActivityCreateDate(user: IUserRole): Moment {
        let weekStart = DateUtilities.getStartOfWeek();
        if (this.userHasAnyRole(user)) {
            weekStart.subtract(7, 'days');
        }
        return weekStart;
    }

    static isActivityEditable(activity: IActivity, user: IUserRole) {
        let isNew = activity.Id < 0;
        let userIsOPR = !activity.OPRs || activity.OPRs.results.some(info => parseInt(info.Id) === parseInt(user.Id));
        let userHasRights = activity.Branch && user.UsersRoles.some(role => activity.Branch.includes(role.department));
        return isNew || userIsOPR || userHasRights;
    }
}