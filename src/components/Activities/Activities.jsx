import moment from 'moment';
import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import './Activities.css';
import ActivitiesApi from './ActivitiesApi';
import ActivitiesApiDev from './ActivitiesApiDev';
import ActivityAccordion from './ActivityAccordion';
import EditActivityModal from './EditActivityModal';

//TODO consider moving away from datetime and going to ISO weeks
class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading: true,
      showEditModal: false,
      editActivity: {},
      loadedWeeks: [],
      loadingMoreWeeks: false,
      saveError: false
    };
    
    this.activitiesAPI = process.env.NODE_ENV === 'development' ? new ActivitiesApiDev() : new ActivitiesApi();
  }

  componentDidMount() {
    let today = new Date();
    let weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay(), 0, 0, 0, 0);
    this.fetchItems(4, weekStart);
  }

  fetchItems = (numWeeks, weekStart) => {
    this.activitiesAPI.fetchActivities(numWeeks, weekStart, this.props.user.Id).then(r => {
      const listData = this.state.listData.concat(r);
      this.setState({ loadingMoreWeeks: false, isLoading: false, listData });
      this.addNewWeeks(numWeeks, weekStart);
    }, e => {
      //TODO better error handling
      this.setState({ loadingMoreWeeks: false, isLoading: false });
    });
  }

  newItem = () => {
    const item = {
      ID: -1, Title: '', WeekOf: moment().day(0), InputWeekOf: moment().day(0).format("YYYY-MM-DD"),
      Branch: 'OZIC', InterestItems: '', ActionItems: '', TextOPRs: this.props.user.Title
    }
    this.setState({ showEditModal: true, editActivity: item });
  }

  submitActivity = (event, newActivity) => {
    this.setState({ isLoading: true });
    //build object to save
    let activityToSubmit = {
      ID: newActivity.ID,
      Title: newActivity.Title,
      WeekOf: moment(newActivity.InputWeekOf).day(0).toISOString(),
      Branch: newActivity.Branch,
      InterestItems: newActivity.InterestItems,
      ActionItems: newActivity.ActionItems,
      TextOPRs: newActivity.TextOPRs //TODO convert to peopler picker format...
    };

    this.activitiesAPI.submitActivity(activityToSubmit).then(r => {
      // filter out the old activity, if it already existed
      let activityList = this.state.listData.filter(activity => activity.ID !== r.data.ID);
      activityList.push(r.data);
      this.setState({ isLoading: false, showEditModal: false, saveError: false, listData: activityList });
    }, e => {
      console.error(e);
      this.setState({ saveError: true, isLoading: false });
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
    const MySpinner = () =>
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="sr-only">Fetching activities...</span>
        </Spinner>
      </div>

    return (
      <Container>
        <EditActivityModal
          key={this.state.editActivity.ID}
          showEditModal={this.state.showEditModal}
          submitEditActivity={this.submitActivity}
          closeEditActivity={this.closeEditActivity}
          activity={this.state.editActivity}
          saving={this.state.isLoading}
          error={this.state.saveError}
        />
        <Row className="justify-content-center"><h1>My Items</h1></Row>
        {this.state.loadedWeeks.map(date =>
          <ActivityAccordion
            key={date}
            weekOf={date}
            actions={this.state.listData}
            newButtonOnClick={() => this.newItem()}
            cardOnClick={(action) => this.cardOnClick(action)}
          />)}
        <Button disabled={loadingMoreWeeks} className="float-right mb-3" variant="primary" onClick={this.loadMoreWeeks}>
          {loadingMoreWeeks && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
          {' '}Load More Activities
        </Button>
        {isLoading && <MySpinner />}
      </Container>
    );
  }
}

export default Activities;
