import moment from 'moment';
import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
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
  }

  componentDidMount() {
    let weekStart = DateUtilities.getStartOfWeek(new Date());
    // TODO: this is the default, but different limits will be implemented after roles are added
    this.setState({ minCreateDate: weekStart });
    this.fetchItems(4, weekStart);
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
      ID: -1, Title: '', WeekOf: moment(date).day(0), InputWeekOf: moment(date).format("YYYY-MM-DD"),
      Branch: 'OZIC', ActionTaken: '', TextOPRs: this.props.user.Title, IsBigRock: false, IsHistoryEntry: false
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
      ActionTaken: newActivity.ActionTaken,
      TextOPRs: newActivity.TextOPRs, //TODO convert to peopler picker format...
      IsBigRock: newActivity.IsBigRock,
      IsHistoryEntry: newActivity.IsHistoryEntry
    };

    // Remove trailing period(s) from Title
    while (activityToSubmit.Title.charAt(activityToSubmit.Title.length - 1) === '.') {
      activityToSubmit.Title = activityToSubmit.Title.slice(0, -1);
    }

    this.activitiesApi.submitActivity(activityToSubmit).then(r => {
      // filter out the old activity, if it already existed
      let activityList = this.state.listData.filter(activity => activity.ID !== r.data.ID);
      activityList.push(r.data);
      this.setState({ isLoading: false, showEditModal: false, saveError: false, listData: activityList });
    }, e => {
      console.error(e);
      this.setState({ saveError: true, isLoading: false });
    });
  }

  deleteActivity = (activity) => {
    this.setState({ isDeleting: true })
    this.activitiesApi.deleteActivity(activity)
      .then((res) => this.setState({
        isDeleting: false,
        showEditModal: false,
        listData: this.state.listData.filter(a => a.ID !== res.data.ID)
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
          handleDelete={this.deleteActivity}
          closeEditActivity={this.closeEditActivity}
          activity={this.state.editActivity}
          deleting={this.state.isDeleting}
          saving={this.state.isLoading}
          error={this.state.saveError}
          minCreateDate={this.state.minCreateDate}
          showBigRockCheck //TODO: should be based on role
          showHistoryCheck //TODO: should be based on role
        />
        <Row className="justify-content-center"><h1>Activities</h1></Row>
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
        {isLoading && <MySpinner />}
      </Container>
    );
  }
}

export default Activities;
