import { IActivity, UserInfo } from "../api/ActivitiesApi";
import { spWebContext } from "../providers/SPWebContext";
import DateUtilities from "./DateUtilities";

export default class ActivityUtilities {
  /**
   * Creates and returns an IActivity that is ready to be submitted to the IActivitiesApi.
   * This method will turn all of the raw input data fields into the nicely formatted data that the API needs.
   *
   * @param activity The activity as built from the input forms.
   * it needs {Id: number, Title: string, WeekOf: string | Moment, Branch: string, ActionTaken: string, IsMarEntry: boolean, IsHistoryEntry: boolean, MARText?: string}
   */
  static async buildActivity(activity: any): Promise<IActivity> {
    let builtActivity: any = {
      Id: activity.Id,
      Title: activity.Title,
      WeekOf: DateUtilities.getDate(activity.WeekOf).day(0).toISOString(),
      Branch: activity.Branch,
      ActionTaken: activity.ActionTaken.trim(),
      IsMarEntry: activity.IsMarEntry,
      IsHistoryEntry: activity.IsHistoryEntry,
      OPRsId: { results: [] },
      MARText: activity.MARText,
    };

    //include etag if it exists - new items will not have an etag
    if (activity.__metadata && activity.__metadata.etag) {
      builtActivity.__metadata = { etag: activity.__metadata.etag };
    }

    //Fetch Id's for new OPRs
    // items fetched from the list will already have an Id
    // newly added OPRs will only have an email that must be converted
    let userIdPromises = activity.OPRs.results.map(async (OPR: UserInfo) => {
      if (OPR.Id !== 0) {
        return OPR.Id;
      } else if (OPR.Email) {
        let ensuredUser = await spWebContext.ensureUser(OPR.Email);
        OPR.Id = ensuredUser.data.Id; // Set the ID so we don't look up user again when editing a new item
        return ensuredUser.data.Id;
      }
    });

    //wait for all promises to fetch UserIds to complete then add array of IDs to activity
    await Promise.all(userIdPromises).then((OPRsId) => {
      builtActivity.OPRsId.results = OPRsId;
    });
    // Remove trailing period(s) from Title
    while (builtActivity.Title.charAt(builtActivity.Title.length - 1) === ".") {
      builtActivity.Title = builtActivity.Title.slice(0, -1);
    }
    return builtActivity;
  }

  /**
   * Creates and returns an updated IActivity after submitting/updating an IActivity.
   *
   * @param res The Result from the IActivity submit, should be {data: {'odata.etag': string}}
   * @param oldActivity The old activity before being built using buildActivity()
   * @param activity The activity that was submitted to the IActivitiesApi
   */
  static updateActivityEtagFromResponse(
    res: any,
    oldActivity: any,
    activity: any
  ) {
    let newActivity = { ...activity, OPRs: oldActivity.OPRs };
    if (res.data["odata.etag"]) {
      // Updated item - set etag on the activity
      newActivity.__metadata = {
        etag: '"' + res.data["odata.etag"].split(",")[1],
      };
    } else {
      // New item - set Id, WeekOf, author, and etag
      newActivity.Id = res.data.Id;
      newActivity.WeekOf = res.data.WeekOf;
      newActivity.__metadata = { etag: res.data.__metadata.etag };
      newActivity.AuthorId = res.data.AuthorId;
    }
    return newActivity;
  }

  /**
   * Returns an array of IActivity that is the given activityList without the given activity.
   *
   * @param activityList The IActivity array to filter
   * @param activity The IActivity to be filtered out of the given activityList
   */
  static filterActivity(activityList: any[], activity: any): any[] {
    return activityList.filter((act) => act.Id !== activity.Id);
  }

  /**
   * Returns a copy of the given activityList that has the IActivity with the same ID as the given newActivity replaced with newActivity.
   *
   * @param activityList The IActivity array that needs an IActivity replaced with newActivity
   * @param newActivity The IActivity that will replace the IActivity with the same ID in activityList
   */
  static replaceActivity(activityList: any[], newActivity: any): any[] {
    let retActivityList = [...activityList];
    // rather than filter out the old activity, update if it already existed
    // this prevents the activity display from re-ordering the existing items

    if (newActivity.__metadata.etag !== '"1"') {
      retActivityList = retActivityList.map((item) => {
        if (item.Id === newActivity.Id) {
          return newActivity;
        }
        return item;
      });
    } else {
      retActivityList.push(newActivity);
    }
    return retActivityList;
  }
}
