import { IItems } from '@pnp/sp/items';
import { ICamlQuery } from '@pnp/sp/lists';
import "@pnp/sp/search";
import { Moment } from 'moment';
import { spWebContext } from '../providers/SPWebContext';
import DateUtilities from '../utilities/DateUtilities';
import ActivitiesApiDev from './ActivitiesApiDev';

// test comment, super cool
export interface UserInfo {
  Id: string,
  Title: string,
  SPUserId?: string,
  text?: string,
  Email?: string
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
  Branch: string, // Org that the Activity affected
  ActionTaken: string, // Main text of the Activity, describing what happened
  IsMarEntry: boolean, // Flag for if the Activity has been tagged for the Monthly Activity Report (MAR)
  IsHistoryEntry: boolean, // Flag for if the Activity has been tagged as a Historical entry
  IsDeleted?: boolean,
  AuthorId?: string,
  OPRs?: UserList, // List of users associated with the Activity
  OPRsId?: UserIdList,
  __metadata?: {
    etag: string
  }
}

export interface IActivityApi {

  /**
   * Returns all IActivites for the number of weeks given, starting at the date given.
   * 
   * @param numWeeks Number of weeks to fetch IActivities for
   * @param weekStart The starting date to begin the fetch
   * @param userId (Optional) ID of the user whose IActivities will be returned
   */
  fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Moment, userId: number): Promise<any>,

  /**
   * Returns IActivities based on all of the (optional) parameters given. The filters applied will use the odata API standard.
   * All parameters are ANDed together, so IActivities returned will have all of the properties given.
   * 
   * @param startDate (Optional) The starting date of the IActivities search
   * @param endDate (Optional) The ending date of the IActivities search
   * @param userId (Optional) The ID of the user whose IActivities to search for
   * @param additionalFilter (Optional) An odata formatted search string to add to the IActivities search
   * @param orderBy (Optional) The IActivities field to order the returned array by
   * @param ascending (Optional) Whether the IActivities array returned should be in ascending order or not based on the orderBy param field
   */
  fetchActivitiesByDates(startDate?: Moment, endDate?: Moment, userId?: number, additionalFilter?: string, orderBy?: string, ascending?: boolean): Promise<any>,

  /**
   * Returns IActivities based on a keyword search along with several more (optional) parameters. 
   * All parameters are ANDed together, so IActivities returned will have all of the properties given.
   * 
   * @param query The keyword to search for IActivities based on
   * @param org (Optional) The Org/Department/Branch to search for IActivities in
   * @param includeSubOrgs (Optional) Flag that determines whether or not to include child orgs for the Org given
   * @param startDate (Optional) The starting date of the IActivities search
   * @param endDate (Optional) The ending date of the IActivities search
   * @param isHistory (Optional) Flag that indicates if the search should only include History entries
   * @param isHistory (Optional) Flag that indicates if the search should only include MAR entries
   * @param userId (Optional) The ID of the user whose IActivities to search for
   */
  fetchActivitiesByQueryString(query: string, org?: string, includeSubOrgs?: boolean, startDate?: Moment, endDate?: Moment, isHistory?: boolean, isMAR?: boolean, userId?: number): Promise<any>,

  /**
   * Returns IActivities that were tagged as MAR entries for the given date search and user.
   * 
   * @param startDate The starting date of the IActivities search
   * @param endDate The ending date of the IActivities search
   * @param userId The ID of the user whose IActivities to search for
   * @param orderBy (Optional) The IActivities field to order the returned array by
   */
  fetchMarEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any>,

  /**
   * Returns IActivities that were tagged as History entries for the given date search and user.
   *
   * @param startDate The starting date of the IActivities search
   * @param endDate The ending date of the IActivities search
   * @param userId The ID of the user whose IActivities to search for
   * @param orderBy (Optional) The IActivities field to order the returned array by
   */
  fetchHistoryEntriesByDates(startDate: Moment, endDate: Moment, userId: number, orderBy?: string): Promise<any>,

  /**
   * Delete the given IActivity from the persistence layer
   * 
   * @param activity The IActivity to delete
   */
  deleteActivity(activity: IActivity): Promise<any>,

  /**
   * Submit a new IActivity or update an existing one.
   * 
   * @param activity The IActivity to submit, if updating the IActivity then the ID field will have a valid ID in it. 
   * If new then the ID should < 0.
   */
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

    let items: IItems = this.activitiesList.items.select("Id", "Title", "WeekOf", "Branch", "AuthorId", "OPRs/Title", "OPRs/Id", "ActionTaken", "IsMarEntry", "IsHistoryEntry", "IsDeleted").expand("OPRs").filter(filterString);
    items = orderBy && orderBy !== null && orderBy !== "" ? items.orderBy(orderBy, ascending === false ? false : true) : items;
    return items.getPaged();
  }

  /**
   * This method will use SharePoint's CAML query, formed in XML, as it is the only way to perform a keyword search.
   * More information on the CAML queries can be found at https://docs.microsoft.com/en-us/sharepoint/dev/schema/view-schema
   * and https://joshmccarty.com/a-caml-query-quick-reference/
   */
  async fetchActivitiesByQueryString(query: string, org?: string, includeSubOrgs?: boolean, startDate?: Moment, endDate?: Moment, isHistory?: boolean, isMAR?: boolean, userId?: number): Promise<IActivity> {

    let conditions: string[] = ["<Neq><FieldRef Name='IsDeleted'/><Value Type='Boolean'>1</Value></Neq>"];
    if (query) {
      conditions.push(`<Contains><FieldRef Name='ActionTaken'/><Value Type='Note'>${query}</Value></Contains>`);
    }
    if (org) {
      conditions.push(`<${includeSubOrgs ? "Contains" : "Eq"}><FieldRef Name='Branch'/><Value Type='Text'>${org}</Value></${includeSubOrgs ? "Contains" : "Eq"}>`);
    }
    if (startDate) {
      conditions.push(`<Geq><FieldRef Name='WeekOf'/><Value Type='DateTime'>${startDate.subtract(1, 'day').toISOString()}</Value></Geq>`);
    }
    if (endDate) {
      // change endDate to be the day after the start of the week so that it does not erroneously include activities from the succeeding week
      conditions.push(`<Leq><FieldRef Name='WeekOf'/><Value Type='DateTime'>${endDate.startOf('week').add(1, 'day').toISOString()}</Value></Leq>`);
    }
    if (isHistory) {
      conditions.push("<Eq><FieldRef Name='IsHistoryEntry'/><Value Type='Boolean'>1</Value></Eq>");
    }
    if (isMAR) {
      conditions.push("<Eq><FieldRef Name='IsMarEntry'/><Value Type='Boolean'>1</Value></Eq>");
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
                    <FieldRef Name='Author' />
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
        AuthorId: activity.Author[0].id,
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