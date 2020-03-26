import { spWebContext } from '../../providers/SPWebContext';

export interface IActivity {
  ID: number,
  Title: string,
  WeekOf: string,
  Branch: string,
  InterestItems: string,
  ActionItems: string,
  TextOPRs: string
}

export interface IActivityApi {
  fetchActivities(numWeeks: number, weekStart: Date, userId: number): Promise<any>,
  submitActivity(activity: IActivity): Promise<{data: IActivity}>
}

export default class ActivitiesApi implements IActivityApi {

  activitiesList = spWebContext.lists.getByTitle("Activities");

  fetchActivities(numWeeks: number, weekStart: Date, userId: number): Promise<any> {
    let maxDate = new Date(weekStart);
    maxDate.setDate(maxDate.getDate() + 1);
    let minDate = new Date(weekStart);
    minDate.setDate(minDate.getDate() - (numWeeks * 7));
    let filterstring = `WeekOf ge '${minDate.toISOString()}' and WeekOf le '${maxDate.toISOString()}'`;
    filterstring += ` and AuthorId eq ${userId}`;

    return this.activitiesList.items.filter(filterstring).get();
  }

  /**
   * This will either submit a new Activity or it will update an 
   * existing one. Both will return the Activity as {data: activity}
   * @param activity The IActivity to be submitted
   */
  submitActivity(activity: IActivity): Promise<{data: IActivity}> {
    return activity.ID < 0 ? this.addActivity(activity) : this.updateActivity(activity);
  }

  /**
   * Trying to match the return behavior of adding a new Activity 
   * so that the returns can be treated the same/similar
   * @param activity The IActivity to be submitted
   */
  async updateActivity(activity: IActivity): Promise<{data: IActivity}> {
    console.log(`Submitting updated item ${activity.Title}!`);
    //TODO Include ETag checks/handling, this returns the new ETag
    let newEtag = await this.activitiesList.items.getById(activity.ID).update(activity);
    // when ETag handling is implemented, we may have some more complex logic than just returning the activity
    return {data: activity}
  }

  addActivity(activity: IActivity): Promise<{data: IActivity}> {
    console.log(`Submitting new item ${activity.Title}!`);
    return this.activitiesList.items.add(activity);
  }
}