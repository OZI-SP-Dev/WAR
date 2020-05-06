import moment from "moment"
import { IActivity } from "../api/ActivitiesApi"
import { IUserRole } from "./RoleUtilities";

export default class ActivityUtilities {

    static getEmptyActivity(date: Date, user: IUserRole): any {
        return {
            ID: -1,
            Title: '',
            WeekOf: moment(date).day(0),
            InputWeekOf: moment(date).format("YYYY-MM-DD"),
            Branch: 'OZIC',
            ActionTaken: '',
            TextOPRs: user.Title,
            IsBigRock: false,
            IsHistoryEntry: false
        }
    }
    
    static buildActivity(activity: any): IActivity {
        let retActivity: IActivity = {
            ID: activity.ID,
            Title: activity.Title,
            WeekOf: moment(activity.InputWeekOf).day(0).toISOString(),
            Branch: activity.Branch,
            ActionTaken: activity.ActionTaken,
            TextOPRs: activity.TextOPRs, //TODO convert to peopler picker format...
            IsBigRock: activity.IsBigRock,
            IsHistoryEntry: activity.IsHistoryEntry
        }
        // Remove trailing period(s) from Title
        while (retActivity.Title.charAt(retActivity.Title.length - 1) === '.') {
            retActivity.Title = retActivity.Title.slice(0, -1);
        }
        return retActivity;
    }

    static filterActivity(activityList: any[], activity: any): any[] {
        return activityList.filter(act => act.ID !== activity.ID);
    }

    static replaceActivity(activityList: any[], activity: any): any[] {
        // filter out the old activity, if it already existed
        let retActivityList = this.filterActivity(activityList, activity);
        retActivityList.push(activity);
        return retActivityList;
    }
}