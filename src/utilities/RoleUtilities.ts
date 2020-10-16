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

    /**
     * Get the default org for review for the given user. If the user is a BRANCH_CHIEF or DIV_CHIEF then
     * it will return the org that they are a chief for. 
     * 
     * If they are chief for multiple orgs: 
     * * If they're nested orgs, return top level org. 
     * * If not nested, returns an empty string, no default org for review.
     * 
     * @param user the user that we're getting the default org for review for
     */
    static getReviewDefaultOrg(user: IUserRole): string {
        let defaultOrg = '';
        let roleOrgs: string[] = this.getOrgsForUserRoles(user);
        if (roleOrgs.length === 1) {
            defaultOrg = roleOrgs[0];
        } else if (roleOrgs.length > 1) {
            defaultOrg = this.getParentOrg(roleOrgs);
        }
        return defaultOrg;
    }

    /**
     * Get an array of the unique orgs for which the user has either of the chief roles for
     * 
     * @param user the user that we're getting the orgs of their roles for
     */
    private static getOrgsForUserRoles(user: IUserRole): string[] {
        let roleOrgs: string[] = [];
        user.UsersRoles.forEach(userRole => {
            if ((userRole.role === this.BRANCH_CHIEF || userRole.role === this.DIV_CHIEF || userRole.role === this.REVIEWER) && !roleOrgs.includes(userRole.department)) {
                roleOrgs.push(userRole.department);
            }
        })
        return roleOrgs;
    }

    /**
     * Returns the parent org of the array of orgs given, if none found then returns an empty string.
     * A parent org would be an org that every org contains so ABC is a parent of ABCD and ABCE.
     * 
     * @param orgs array of orgs to search for the parent within
     */
    private static getParentOrg(orgs: string[]): string {
        let parent = orgs[0];
        while (parent.length > 1) {
            // assign parent in the loop because of ts loop reference error 'no-loop-func'
            let newParent = parent;
            if (orgs.every(o => o.includes(newParent))) {
                return newParent;
            }
            parent = newParent.substring(0, newParent.length - 1);
        }
        return '';
    }
}