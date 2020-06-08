import { IActivity } from "../api/ActivitiesApi";
import { spWebContext } from "../providers/SPWebContext";
import DateUtilities from "./DateUtilities";

export default class ActivityUtilities {

	static async buildActivity(activity: any): Promise<IActivity> {
		let builtActivity: any = {
			Id: activity.Id,
			Title: activity.Title,
			WeekOf: DateUtilities.getDate(activity.InputWeekOf).day(0).toISOString(),
			Branch: activity.Branch,
			ActionTaken: activity.ActionTaken.trim(),
			IsBigRock: activity.IsBigRock,
			IsHistoryEntry: activity.IsHistoryEntry,
			OPRsId: { results: [] }
		};

		//include etag if it exists - new items will not have an etag
		if (activity.__metadata && activity.__metadata.etag) {
			builtActivity.__metadata = { etag: activity.__metadata.etag };
		}

		//Fetch Id's for new OPRs
		// items fetched from the list will already have an Id
		// newly added OPRs will only have an email that must be converted
		let userIdPromises = activity.OPRs.results.map(async (OPR: any) => {
			if (OPR.Id) {
				return OPR.Id;
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

	static updateActivityEtagFromResponse(res: any, oldActivity: any, activity: any) {
		let newActivity = { ...activity, OPRs: oldActivity.OPRs };
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

	static replaceActivity(activityList: any[], newActivity: any): any[] {
		let retActivityList = [...activityList];
		// rather than filter out the old activity, update if it already existed
		// this prevents the activity display from re-ordering the existing items

		if (newActivity.__metadata.etag !== '"1"') {
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