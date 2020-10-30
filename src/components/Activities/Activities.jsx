import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import { UserPreferencesApiConfig } from '../../api/UserPreferencesApi';
import ActivityUtilities from '../../utilities/ActivityUtilities';
import DateUtilities from '../../utilities/DateUtilities';
import RoleUtilities from '../../utilities/RoleUtilities';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
import ActivitySpinner from './ActivitySpinner';
import EditActivityModal from './EditActivityModal';

//TODO consider moving away from datetime and going to ISO weeks
class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading: true,
      isDeleting: false,
      showEditModal: false,
      editActivity: {},
      loadedWeeks: [],
      loadingMoreWeeks: false,
      saveError: false,
      minCreateDate: RoleUtilities.getMinActivityCreateDate(this.props.user)
    };

    this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    this.userPreferencesApi = UserPreferencesApiConfig.userPreferencesApi;
    this.Me = {
      Title: this.props.user.Title,
      Id: this.props.user.Id
    }
  }

  componentDidMount() {
    this.fetchItems(4, DateUtilities.getStartOfWeek());
  }

  fetchItems = async (numWeeks, weekStart) => {
    try {
      let items = await this.activitiesApi.fetchActivitiesByNumWeeks(numWeeks, weekStart, this.props.user.Id);
      let results = items.results;
      while (items.hasNext) {
        items = await items.getNext();
        results = results.concat(items.results);
      }
      const listData = this.state.listData.concat(results);
      this.setState({ loadingMoreWeeks: false, isLoading: false, listData });
      this.addNewWeeks(numWeeks, weekStart);
    } catch (e) {
      console.log('error fetching activities: ' + e);
      this.setState({ loadingMoreWeeks: false, isLoading: false });
    }
  }

  newItem = (date, activity) => {
    const item = {
      Id: -1,
      Title: activity ? "Copy of " + activity.Title : '',
      WeekOf: DateUtilities.getStartOfWeek(date).toISOString(),
      InputWeekOf: DateUtilities.getDate(date).format("YYYY-MM-DD"),
      Branch: activity ? activity.Branch : this.props.user.UserPreferences.DefaultOrg ? this.props.user.UserPreferences.DefaultOrg : '',
      ActionTaken: activity ? activity.ActionTaken : '',
      IsMarEntry: false,
      IsHistoryEntry: false,
      OPRs: activity ? activity.OPRs : { results: [this.Me] }
    }
    this.setState({ showEditModal: true, editActivity: item });
  }


  submitActivity = async (activity) => {
    this.setState({ isLoading: true });
    //build object to save
    let activityToSubmit = await ActivityUtilities.buildActivity(activity);

    this.activitiesApi.submitActivity(activityToSubmit).then(r => {
      // Newly created list items return the complete item
      // Updated list items only return an 'odata.etag' prop
      //  !! not an odata object with an etag prop !!

      activityToSubmit = ActivityUtilities.updateActivityEtagFromResponse(r, activity, activityToSubmit);

      if (activity.Id < 0 && activity.Branch !== this.props.user.UserPreferences.DefaultOrg) {
        this.props.user.UserPreferences.updateDefaultOrg(activity.Branch);
      }

      this.setState({
        isLoading: false,
        showEditModal: false,
        saveError: false,
        listData: ActivityUtilities.replaceActivity(this.state.listData, activityToSubmit)
      });
    }, e => {
      console.error(e);
      this.setState({ saveError: true, isLoading: false });
    });
  }

  deleteActivity = async (activity) => {
    this.setState({ isDeleting: true })
    this.activitiesApi.deleteActivity(await ActivityUtilities.buildActivity(activity))
      .then((res) => this.setState({
        isDeleting: false,
        showEditModal: false,
        listData: ActivityUtilities.filterActivity(this.state.listData, activity)
      }), e => {
        console.error(e);
        this.setState({ isDeleting: false, showEditModal: false });
      });
  }

  addNewWeeks = (numWeeks, weekStart) => {
    let newWeeks = this.state.loadedWeeks;
    for (let i = 0; i < numWeeks; ++i) {
      let week = DateUtilities.getDate(weekStart);
      week.subtract(7 * i, 'days');
      newWeeks.push(week);
    }
    this.setState({ loadedWeeks: newWeeks });
  }

  loadMoreWeeks = () => {
    this.setState({ loadingMoreWeeks: true })
    let lastWeekLoaded = this.state.loadedWeeks[this.state.loadedWeeks.length - 1];
    let nextWeekStart = DateUtilities.getDate(lastWeekLoaded);
    nextWeekStart.subtract(7, 'days');
    this.fetchItems(4, nextWeekStart);
  }

  closeEditActivity = () => {
    this.setState({ showEditModal: false, saveError: false });
  }

  cardOnClick(action) {
    let editActivity = action;
    this.setState({ showEditModal: true, editActivity });
  }

  render() {
    const { isLoading, loadingMoreWeeks } = this.state;

    return (
      <Container fluid>
        <EditActivityModal
          key={this.state.editActivity.Id}
          showEditModal={this.state.showEditModal}
          submitEditActivity={this.submitActivity}
          handleDelete={this.deleteActivity}
          closeEditActivity={this.closeEditActivity}
          activity={this.state.editActivity}
          deleting={this.state.isDeleting}
          saving={this.state.isLoading}
          error={this.state.saveError}
          canEdit={(act) => RoleUtilities.isActivityEditable(act, this.props.user)}
          minCreateDate={this.state.minCreateDate}
          showMarCheck={(org) => RoleUtilities.userCanSetMar(this.props.user, org)}
          showHistoryCheck={(org) => RoleUtilities.userCanSetHistory(this.props.user, org)}
          userIsOrgChief={(org) => RoleUtilities.userIsBranchChiefOrHigher(this.props.user, org)}
        />
        <Row className="justify-content-center m-3"><h1>My Activities</h1></Row>
        {this.state.loadedWeeks.map(date =>
          <ActivityAccordion
            key={date}
            weekOf={date}
            actions={this.state.listData}
            newButtonOnClick={() => this.newItem(date)}
            cardOnClick={(action) => this.cardOnClick(action)}
            disableNewButton={this.state.showEditModal}
            showNewButton={date >= this.state.minCreateDate}
            copyOnClick={(activity => this.newItem(DateUtilities.getStartOfWeek(), activity))}
          />)}
        <Button disabled={loadingMoreWeeks} className="float-right mb-3" variant="primary" onClick={this.loadMoreWeeks}>
          {loadingMoreWeeks && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
          {' '}Load More Activities
        </Button>
        <ActivitySpinner show={isLoading} displayText="Fetching activities..." />
      </Container>
    );
  }
}

export default Activities;
