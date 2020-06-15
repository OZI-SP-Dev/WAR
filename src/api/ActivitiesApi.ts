import { IItems } from '@pnp/sp/items';
import { ICamlQuery } from '@pnp/sp/lists';
import "@pnp/sp/search";
import { Moment } from 'moment';
import { spWebContext } from '../providers/SPWebContext';
import DateUtilities from '../utilities/DateUtilities';
import ActivitiesApiDev from './ActivitiesApiDev';

export interface UserInfo {
  Id: string,
  Title: string,
  SPUserId?: string,
  text?: string
}

export interface UserList {
  results: UserInfo[]
}

export interface UserIdList {
  results: number[]
}

export interface IActivity {
  Id: number,
  Title: string,
  WeekOf: string,
  Branch: string,
  ActionTaken: string,
  IsMarEntry: boolean,
  IsHistoryEntry: boolean,
  IsDeleted?: boolean,
  OPRs?: UserList,
  OPRsId?: UserIdList,
  __metadata?: {
    etag: string
  }
}

export interface IActivityApi {
  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Moment, userId: number): Promise<any>,
	fetchActivitiesByDates(startDate?: Moment, endDate?: Moment, userId?: number, additionalFilter?: string, orderBy?: string, ascending?: boolean): Promise<any>,
  fetchActivitiesByQueryString(query: string, org?: string, includeSubOrgs?: boolean, startDate?: Moment, endDate?: Moment, userId?: number): Promise<any>,
  fetchMarEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any>,
  fetchHistoryEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any>,
  deleteActivity(activity: IActivity): Promise<any>,
  submitActivity(activity: IActivity): Promise<{ data: IActivity }>
}

export default class ActivitiesApi implements IActivityApi {

  activitiesList = spWebContext.lists.getByTitle("Activities");

  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Moment, userId: number): Promise<any> {
    let maxDate = DateUtilities.getDate(weekStart);
    maxDate.add(1, 'day');
    let minDate = DateUtilities.getDate(weekStart);
    minDate.subtract((numWeeks - 1) * 7, 'days');
    return this.fetchActivitiesByDates(minDate, maxDate, userId);
  }

  fetchActivitiesByDates(startDate?: Moment, endDate?: Moment, userId?: number, additionalFilter?: string, orderBy?: string, ascending?: boolean): Promise<any> {
    let filterString = "IsDeleted ne 1"
    filterString += startDate ? ` and WeekOf ge '${startDate.toISOString()}'` : "";
    filterString += endDate ? ` and WeekOf le '${endDate.toISOString()}'` : "";
    filterString += userId && userId !== null ? ` and (AuthorId eq ${userId} or OPRs/Id eq ${userId})` : "";
    filterString += additionalFilter ? ` and ${additionalFilter}` : "";

    let items: IItems = this.activitiesList.items.select("Id", "Title", "WeekOf", "Branch", "OPRs/Title", "OPRs/Id", "Org", "ActionTaken", "IsMarEntry", "IsHistoryEntry", "IsDeleted").expand("OPRs").filter(filterString);
		items = orderBy && orderBy !== null && orderBy !== "" ? items.orderBy(orderBy, ascending === false ? false : true) : items;
    return items.get();
  }

  async fetchActivitiesByQueryString(query: string, org?: string, includeSubOrgs?: boolean, startDate?: Moment, endDate?: Moment, userId?: number): Promise<IActivity> {

    let conditions: string[] = ["<Neq><FieldRef Name='IsDeleted'/><Value Type='Boolean'>1</Value></Neq>"];
    if (query) {
      conditions.push(`<Contains><FieldRef Name='ActionTaken'/><Value Type='Note'>${query}</Value></Contains>`);
    }
    if (org) {
      conditions.push(`<${includeSubOrgs ? "Contains" : "Eq"}><FieldRef Name='Branch'/><Value Type='Text'>${org}</Value></${includeSubOrgs ? "Contains" : "Eq"}>`);
    }
    if (startDate) {
      conditions.push(`<Geq><FieldRef Name='WeekOf'/><Value Type='DateTime'>${startDate.toISOString()}</Value></Geq>`);
    }
    if (endDate) {
      conditions.push(`<Leq><FieldRef Name='WeekOf'/><Value Type='DateTime'>${endDate.toISOString()}</Value></Leq>`);
    }
    if (userId) {
      conditions.push(`<Or><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'>${userId}</Value></Eq>
                           <Eq><FieldRef Name='OPRs' LookupId='True'/><Value Type='Lookup'>${userId}</Value></Eq>
                       </Or>`);
    }
    let queryString = "";
    conditions.forEach((condition, i) => {
      queryString += i < conditions.length - 1 ? "<And>" : "";
      queryString += condition;
    })
    for (let i = 0; i < conditions.length - 1; ++i) {
      queryString += "</And>"
    }

    const caml: ICamlQuery = {
      ViewXml: `<View>
                  <ViewFields>
                    <FieldRef Name='Id' />
                    <FieldRef Name='Title' />
                    <FieldRef Name='WeekOf' />
                    <FieldRef Name='Branch' />
                    <FieldRef Name='ActionTaken' />
                    <FieldRef Name='OPRs' />
                    <FieldRef Name='IsMarEntry' />
                    <FieldRef Name='IsHistoryEntry' />
                    <FieldRef Name='IsDeleted' />
                  </ViewFields>
                  <Query>
                    <Where>
                      ${queryString}
                    </Where>
                    <OrderBy>
											<FieldRef Name='Branch' Ascending='True'/>
											<FieldRef Name='WeekOf' Ascending='FALSE'/>
                    </OrderBy>
                  </Query>
                </View>`,
    };
    let newActivities = await this.activitiesList.renderListDataAsStream(caml);
    /* Of course SharePoint doesn't return data in the same format from this function as it does
       with the REST API. Below steps convert to the standard format so results can be used normally */
    return newActivities.Row.map((activity: any) => {
      return {
        Id: activity.ID,
        Title: activity.Title,
        WeekOf: activity["WeekOf."],
        Branch: activity.Branch,
        ActionTaken: activity.ActionTaken,
        IsMarEntry: activity.IsMarEntry === "Yes" ? true : false,
        IsHistoryEntry: activity.IsHistoryEntry === "Yes" ? true : false,
        IsDeleted: activity.IsDeleted === "Yes" ? true : false,
        OPRs: {
          results: activity.OPRs.map((OPR: any) => {
            return {
              Id: OPR.id,
              Email: OPR.email,
              Title: OPR.title
            };
          })
        },
        __metadata: { etag: `"${activity.owshiddenversion}"` }
      };
    });
  }

  fetchMarEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsMarEntry eq 1", orderBy);
  }

  fetchHistoryEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any> {
    return this.fetchActivitiesByDates(startDate, endDate, userId, "IsHistoryEntry eq 1", orderBy);
  }

  deleteActivity(activity: IActivity): Promise<any> {
    let deletedActivity: IActivity = { ...activity, IsDeleted: true };
    return this.updateActivity(deletedActivity);
  }

  /**
   * This will either submit a new Activity or it will update an 
   * existing one. Both will return the Activity as {data: activity}
   * @param activity The IActivity to be submitted
   */
  submitActivity(activity: IActivity): Promise<{ data: IActivity }> {
    return activity.Id < 0 ? this.addActivity(activity) : this.updateActivity(activity);
  }

  /**
   * Trying to match the return behavior of adding a new Activity 
   * so that the returns can be treated the same/similar
   * @param activity The IActivity to be submitted
   */
  async updateActivity(activity: IActivity): Promise<{ data: IActivity }> {
    let etag = activity.__metadata?.etag;
    if (etag) {
      delete activity.__metadata;
		}
		// @ts-ignore
    return this.activitiesList.items.getById(activity.Id).update(activity, etag);
  }

  addActivity(activity: IActivity): Promise<{ data: IActivity }> {
    return this.activitiesList.items.add(activity);
  }
}

export class ActivitiesApiConfig {
  static activitiesApi: IActivityApi = process.env.NODE_ENV === 'development' ? new ActivitiesApiDev() : new ActivitiesApi();
}