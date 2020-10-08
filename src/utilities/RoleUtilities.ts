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

    static userCanSetMar(user: IUserRole, org: string): boolean {
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
        let userIsAuthor = activity.AuthorId && parseInt(activity.AuthorId) === parseInt(user.Id);
        let userIsOPR = !activity.OPRs || activity.OPRs.results.some(info => parseInt(info.Id) === parseInt(user.Id));
        let userHasRights = activity.Branch && user.UsersRoles.some(role => activity.Branch.includes(role.department));
        return isNew || userIsAuthor || userIsOPR || userHasRights;
    }

    static getReviewDefaultOrgs(user: IUserRole): { org: string, includeSubOrgs: boolean } {
        let defaultOrgs = { org: '', includeSubOrgs: false };
        let chiefOrgs: string[] = [];
        for (let userRole of user.UsersRoles) {
            if ((userRole.role === this.BRANCH_CHIEF || userRole.role === this.DIV_CHIEF) && !chiefOrgs.includes(userRole.department)) {
                chiefOrgs.push(userRole.department);
            }
        }
        if (chiefOrgs.length === 1) {
            defaultOrgs.org = chiefOrgs[0];
            defaultOrgs.includeSubOrgs = chiefOrgs[0].length < 4;
        } else if (chiefOrgs.length > 1) {
            // parent org would be an org that every org contains so ABC is a parent of ABCD and ABCE
            let parentOrg = chiefOrgs.find(org => chiefOrgs.every(o => o.includes(org)));
            if (parentOrg) {
                defaultOrgs.org = parentOrg;
                defaultOrgs.includeSubOrgs = true;
            } else {
                // we know that there is no parent that the user is assigned as the chief
                // so now we need to learn if there is a common parent among the children that they are assigned
                let parent = chiefOrgs[0];
                let isParent = false;
                while (!isParent && parent.length > 2) {
                    parent = parent.substring(0, parent.length - 1); // cut off last letter
                    isParent = chiefOrgs.every(o => o.includes(parent));
                }
                if (isParent) {
                    defaultOrgs.org = parent;
                    defaultOrgs.includeSubOrgs = true;
                }
            }
        }
        return defaultOrgs;
    }
}