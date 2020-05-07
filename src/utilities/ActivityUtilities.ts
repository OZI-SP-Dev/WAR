import moment from "moment"
import { IActivity } from "../api/ActivitiesApi"
import { IUserRole } from "./RoleUtilities";
import { spWebContext } from "../providers/SPWebContext";

export default class ActivityUtilities {

    static async buildActivity(activity: any): Promise<IActivity> {
        let builtActivity: any = {
            Id: activity.Id,
            Title: activity.Title,
            WeekOf: moment(activity.InputWeekOf).day(0).toISOString(),
            Branch: activity.Branch,
            ActionTaken: activity.ActionTaken,
            IsBigRock: activity.IsBigRock,
            IsHistoryEntry: activity.IsHistoryEntry,
            OPRsId: { results: [] }
        };

        //include etag if it exists - new items will not have an etag
        if (activity.__metadata && activity.__metadata.etag) {
            builtActivity.__metadata = { etag: activity.__metadata.etag };
        }

        //Fetch Id's for new OPRs
        // items fetched from the list will already have an SPUserId
        // newly added OPRs will only have an email that must be converted
        let userIdPromises = activity.OPRs.map(async (OPR: any) => {
            if (OPR.SPUserId) {
                return OPR.SPUserId;
            } else if (OPR.Email) {
                let ensuredUser = await spWebContext.ensureUser(OPR.Email);
                return ensuredUser.data.Id;
            }
        });

        //wait for all promises to fetch UserIds to complete then add array of IDs to activity
        await Promise.all(userIdPromises).then(OPRsId => {
            builtActivity.OPRsId.results = OPRsId;
        });
        // Remove trailing period(s) from Title
        while (builtActivity.Title.charAt(builtActivity.Title.length - 1) === '.') {
            builtActivity.Title = builtActivity.Title.slice(0, -1);
        }
        return builtActivity;
    }

    static updateActivityEtagFromResponse(res: any, activity: any) {
        let newActivity = {...activity};
        if (res.data['odata.etag']) {
            // Updated item - set etag on the activity
            newActivity.__metadata = { etag: ('"' + res.data['odata.etag'].split(',')[1]) };
        } else {
            // New item - set Id, WeekOf, and etag
            newActivity.Id = res.data.Id;
            newActivity.WeekOf = res.data.WeekOf;
            newActivity.__metadata = { etag: res.data.__metadata.etag };
        }
        return newActivity;
    }

    static filterActivity(activityList: any[], activity: any): any[] {
        return activityList.filter(act => act.Id !== activity.Id);
    }

    static replaceActivity(activityList: any[], oldActivity: any, newActivity: any): any[] {
        let retActivityList = [...activityList];
        // rather than filter out the old activity, update if it already existed
        // this prevents the activity display from re-ordering the existing items
        if (oldActivity.Id > 0) {
            retActivityList = retActivityList.map(item => {
                if (item.Id === newActivity.Id) {
                    return (newActivity);
                }
                return item;
            })
        } else {
            retActivityList.push(newActivity);
        }
        return retActivityList;
    }
}