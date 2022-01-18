import { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { ActivitiesApiConfig, IActivity } from "../../api/ActivitiesApi";
import ActivityUtilities from "../../utilities/ActivityUtilities";
import DateUtilities from "../../utilities/DateUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import ActivityAccordion from "./ActivityAccordion";
import ActivitySpinner from "./ActivitySpinner";
import EditActivityModal from "./EditActivityModal";

export interface IActivitiesProps {
  user: IUserRole
}

export const Activities: React.FunctionComponent<IActivitiesProps> = (props) => {

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editActivity, setEditActivity] = useState<IActivity>({
    Id: -1,
    Title: '',
    WeekOf: DateUtilities.getStartOfWeek().toISOString(),
    Branch: '',
    ActionTaken: '',
    IsMarEntry: false,
    IsHistoryEntry: false,
    OPRs: { results: [{ Id: props.user.Id, Title: props.user.Title }] }
  });
  const [loadedWeeks, setLoadedWeeks] = useState<Moment[]>([]);
  const [loadingMoreWeeks, setLoadingMoreWeeks] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);

  const activitiesApi = ActivitiesApiConfig.activitiesApi;
  const minCreateDate = RoleUtilities.getMinActivityCreateDate(props.user);

  const fetchItems = async (numWeeks: number, weekStart: Moment) => {
    try {
      let items = await activitiesApi.fetchActivitiesByNumWeeks(numWeeks, weekStart, parseInt(props.user.Id));
      let results = items.results;
      while (items.hasNext) {
        items = await items.getNext();
        results = results.concat(items.results);
      }
      const newActivities: IActivity[] = activities.concat(results);
      setActivities(newActivities);
      addNewWeeks(numWeeks, weekStart);
      setIsLoading(false);
      setLoadingMoreWeeks(false);
    } catch (e) {
      console.log('error fetching activities: ' + e);
      setLoadingMoreWeeks(false);
      setIsLoading(false);
    }
  }

  const newItem = (date: Moment | Date | string, activity?: IActivity) => {
    const newActivity: IActivity = {
      Id: -1,
      Title: activity ? "Copy of " + activity.Title : '',
      WeekOf: DateUtilities.getStartOfWeek(date).toISOString(),
      Branch: activity ? activity.Branch : props.user.UserPreferences.DefaultOrg ? props.user.UserPreferences.DefaultOrg : '',
      ActionTaken: activity ? activity.ActionTaken : '',
      IsMarEntry: false,
      IsHistoryEntry: false,
      OPRs: activity ? activity.OPRs : { results: [{ Id: props.user.Id, Title: props.user.Title }] }
    }
    setEditActivity(newActivity);
    setShowEditModal(true);
  }


  const submitActivity = async (activity: IActivity) => {
    setIsLoading(true);
    // build object to save
    let activityToSubmit = await ActivityUtilities.buildActivity(activity);
    try {
      const res = await activitiesApi.submitActivity(activityToSubmit)
      // Newly created list items return the complete item
      // Updated list items only return an 'odata.etag' prop
      //  !! not an odata object with an etag prop !!

      activityToSubmit = ActivityUtilities.updateActivityEtagFromResponse(res, activity, activityToSubmit);

      if (activity.Id < 0 && activity.Branch !== props.user.UserPreferences.DefaultOrg && props.user.UserPreferences.updateDefaultOrg) {
        props.user.UserPreferences.updateDefaultOrg(activity.Branch);
      }

      setIsLoading(false);
      setShowEditModal(false);
      setSaveError(false);
      setActivities(ActivityUtilities.replaceActivity(activities, activityToSubmit));
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setSaveError(false);
    }
  }

  const deleteActivity = async (activity: IActivity) => {
    setIsDeleting(true);
    try {
      await activitiesApi.deleteActivity(await ActivityUtilities.buildActivity(activity));
      setIsDeleting(false);
      setShowEditModal(false);
      setActivities(ActivityUtilities.filterActivity(activities, activity));
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
      setShowEditModal(false);
    };
  }

  const addNewWeeks = (numWeeks: number, weekStart: Moment) => {
    let newWeeks = loadedWeeks;
    for (let i = 0; i < numWeeks; ++i) {
      let week = DateUtilities.getDate(weekStart);
      week.subtract(7 * i, 'days');
      newWeeks.push(week);
    }
    setLoadedWeeks(newWeeks);
  }

  const loadMoreWeeks = () => {
    setLoadingMoreWeeks(true);
    let lastWeekLoaded = loadedWeeks[loadedWeeks.length - 1];
    let nextWeekStart = DateUtilities.getDate(lastWeekLoaded);
    nextWeekStart.subtract(7, 'days');
    fetchItems(4, nextWeekStart);
  }

  const closeEditActivity = () => {
    setShowEditModal(false);
    setSaveError(false);
  }

  const cardOnClick = (activity: IActivity) => {
    setShowEditModal(true);
    setEditActivity(activity);
  }

  useEffect(() => {
    fetchItems(4, DateUtilities.getStartOfWeek());
    // eslint-disable-next-line --- OK to ingore for now as will only run once at load
  }, []);

  return (
    <Container fluid>
      <EditActivityModal
        key={editActivity?.Id}
        showEditModal={showEditModal}
        submitEditActivity={submitActivity}
        handleDelete={deleteActivity}
        closeEditActivity={closeEditActivity}
        activity={editActivity}
        deleting={isDeleting}
        saving={isLoading}
        error={saveError}
        canEdit={(act: IActivity) => RoleUtilities.isActivityEditable(act, props.user)}
        minCreateDate={minCreateDate}
        showMarCheck={(org: string) => RoleUtilities.userCanSetMar(props.user, org)}
        showHistoryCheck={(org: string) => RoleUtilities.userCanSetHistory(props.user, org)}
        userIsOrgChief={(org: string) => RoleUtilities.userIsBranchChiefOrHigher(props.user, org)}
      />
      <Row className="justify-content-center m-3"><h1>My Activities</h1></Row>
      {
        loadedWeeks.map(date =>
          <ActivityAccordion
            key={date.toISOString()}
            weekOf={date}
            activities={activities}
            newButtonOnClick={() => newItem(date)}
            cardOnClick={(activity: IActivity) => cardOnClick(activity)}
            disableNewButton={showEditModal}
            showNewButton={date >= minCreateDate}
            copyOnClick={(activity: IActivity) => newItem(DateUtilities.getStartOfWeek(), activity)}
          />)
      }
      <Button disabled={loadingMoreWeeks} className="float-right mb-3" variant="primary" onClick={loadMoreWeeks}>
        {loadingMoreWeeks && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
        {' '}Load More Activities
      </Button>
      <ActivitySpinner show={isLoading} displayText="Fetching activities..." />
    </Container >
  );
}

export default Activities;
