import { spWebContext } from '../providers/SPWebContext';
import ActivitiesApiDev from './ActivitiesApiDev';

export interface UserInfo {
	Id: string,
	Title: string
}

export interface UserList {
	results: UserInfo[]
}

export interface UserIdList {
	results: number[]
}

export interface IActivity {
  ID: number,
  Title: string,
  WeekOf: string,
  Branch: string,
  ActionTaken: string,
  IsBigRock: boolean,
  IsHistoryEntry: boolean,
	IsDeleted?: boolean,
	OPRs?: UserList,
	OPRsId?: UserIdList
}

export interface IActivityApi {
  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any>,
  fetchActivitiesByDates(startDate: Date, endDate: Date, userId: number): Promise<any>,
  fetchBigRocksByDates(startDate: Date, endDate: Date, userId: number): Promise<any>,
  fetchHistoryEntriesByDates(startDate: Date, endDate: Date, userId: number): Promise<any>,
  deleteActivity(activity: IActivity): Promise<any>,
  submitActivity(activity: IActivity): Promise<{ data: IActivity }>
}

export default class ActivitiesApi implements IActivityApi {

  activitiesList = spWebContext.lists.getByTitle("Activities");

  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any> {
    let maxDate = new Date(weekStart);
    maxDate.setDate(maxDate.getDate() + 1);
    let minDate = new Date(weekStart);
    minDate.setDate(minDate.getDate() - (numWeeks * 7));
    return this.fetchActivitiesByDates(minDate, maxDate, userId);
  }

  fetchActivitiesByDates(startDate: Date, endDate: Date, userId: number, additionalFilter?: string): Promise<any> {
    let filterString = `IsDeleted ne 1 and WeekOf ge '${startDate.toISOString()}' and WeekOf le '${endDate.toISOString()}'`
    if (userId && userId != null) {
      filterString += ` and AuthorId eq ${userId}`;
    }

    filterString += additionalFilter ? ` and ${additionalFilter}` : "";

		return this.activitiesList.items.select("Id", "Title", "WeekOf", "Branch", "ActionItems", "OPRs/Title", "OPRs/Id", "Org", "ActionTaken", "IsBigRock", "IsHistoryEntry", "IsDeleted").expand("OPRs").filter(filterString).get();
  }

  fetchBigRocksByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsBigRock eq 1");
  }

  fetchHistoryEntriesByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsHistoryEntry eq 1");
  }

  deleteActivity(activity: IActivity): Promise<any> {
    let deletedActivity: IActivity = { ...activity, IsDeleted: true};
    return this.updateActivity(deletedActivity);
  }
  
  /**
   * This will either submit a new Activity or it will update an 
   * existing one. Both will return the Activity as {data: activity}
   * @param activity The IActivity to be submitted
   */
  submitActivity(activity: IActivity): Promise<{ data: IActivity }> {
    return activity.ID < 0 ? this.addActivity(activity) : this.updateActivity(activity);
  }

  /**
   * Trying to match the return behavior of adding a new Activity 
   * so that the returns can be treated the same/similar
   * @param activity The IActivity to be submitted
   */
  async updateActivity(activity: IActivity): Promise<{ data: IActivity }> {
    console.log(`Submitting updated item ${activity.Title}!`);
    //TODO Include ETag checks/handling, this returns the new ETag
    let newEtag = await this.activitiesList.items.getById(activity.ID).update(activity);
    // when ETag handling is implemented, we may have some more complex logic than just returning the activity
    return { data: activity }
  }

  addActivity(activity: IActivity): Promise<{ data: IActivity }> {
    console.log(`Submitting new item ${activity.Title}!`);
    return this.activitiesList.items.add(activity);
  }
}

export class ActivitiesApiConfig {
  static activitiesApi: IActivityApi = process.env.NODE_ENV === 'development' ? new ActivitiesApiDev() : new ActivitiesApi();
}