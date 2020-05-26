import moment from 'moment';
import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
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
      minCreateDate: {}
    };

    this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    this.Me = {
      Title: this.props.user.Title,
      Id: this.props.user.Id
    }
  }

  componentDidMount() {
    this.setState({ minCreateDate: RoleUtilities.getMinActivityCreateDate(this.props.user) });
    this.fetchItems(4, DateUtilities.getStartOfWeek(new Date()));
  }

  fetchItems = (numWeeks, weekStart) => {
    this.activitiesApi.fetchActivitiesByNumWeeks(numWeeks, weekStart, this.props.user.Id).then(r => {
      const listData = this.state.listData.concat(r);
      this.setState({ loadingMoreWeeks: false, isLoading: false, listData });
      this.addNewWeeks(numWeeks, weekStart);
    }, e => {
      //TODO better error handling
      this.setState({ loadingMoreWeeks: false, isLoading: false });
    });
  }

  newItem = (date) => {
    const item = {
      Id: -1,
      Title: '',
      WeekOf: moment(date).day(0),
      InputWeekOf: moment(date).format("YYYY-MM-DD"),
      Branch: '', // TODO: Pull user's default
      ActionTaken: '',
      IsBigRock: false,
      IsHistoryEntry: false,
      OPRs: { results: [this.Me] }
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
      let week = new Date(weekStart);
      week.setDate(weekStart.getDate() - (7 * i));
      newWeeks.push(week);
    }
    this.setState({ loadedWeeks: newWeeks });
  }

  loadMoreWeeks = () => {
    this.setState({ loadingMoreWeeks: true })
    let lastWeekLoaded = this.state.loadedWeeks[this.state.loadedWeeks.length - 1];
    let nextWeekStart = new Date(lastWeekLoaded);
    nextWeekStart.setDate(lastWeekLoaded.getDate() - 7);
    this.fetchItems(4, nextWeekStart);
  }

  closeEditActivity = () => {
    this.setState({ showEditModal: false, saveError: false });
  }

  cardOnClick(action) {
    let editActivity = action;
    editActivity.InputWeekOf = editActivity.WeekOf.split('T', 1)[0];
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
          showBigRockCheck={(org) => RoleUtilities.userCanSetBigRock(this.props.user, org)}
          showHistoryCheck={(org) => RoleUtilities.userCanSetHistory(this.props.user, org)}
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
