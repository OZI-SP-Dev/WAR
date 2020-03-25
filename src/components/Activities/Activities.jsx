import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { spWebContext } from '../../providers/SPWebContext';
import moment from 'moment';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
import EditActivityModal from './EditActivityModal';
import ActivityDev from './ActivityDev';

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
    this.web = spWebContext;
  }

  componentDidMount() {
    let today = new Date();
    let weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay(), 0, 0, 0, 0);
    this.fetchItems(4, weekStart);
  }

  fetchItems = (numWeeks, weekStart) => {
    if (process.env.NODE_ENV === 'development') {
      ActivityDev.GetActivityDevDefaults().then(r => {
        this.setState({ loadingMoreWeeks: false, isLoading: false, listData: r });
        this.addNewWeeks(numWeeks, weekStart);
      });
    } else {
      let maxDate = new Date(weekStart);
      maxDate.setDate(maxDate.getDate() + 1);
      let minDate = new Date(weekStart);
      minDate.setDate(minDate.getDate() - (numWeeks * 7));
      let filterstring = `WeekOf ge '${minDate.toISOString()}' and WeekOf le '${maxDate.toISOString()}'`;
      filterstring += ` and AuthorId eq ${this.props.user.Id}`;

      this.web.lists.getByTitle("Activities").items.filter(filterstring).get().then(r => {
        const listData = this.state.listData.concat(r);
        this.setState({ loadingMoreWeeks: false, isLoading: false, listData });
        this.addNewWeeks(numWeeks, weekStart);
      }, e => {
        //TODO better error handling
        this.setState({ loadingMoreWeeks: false, isLoading: false });
      });
    }
  }

  newItem = () => {
    const item = {
      ID: -1, Title: '', WeekOf: moment().day(0), InputWeekOf: moment().day(0).format("YYYY-MM-DD"),
      Branch: 'OZIC', InterestItems: '', ActionItems: '', TextOPRs: this.props.user.Title
    }
    this.setState({ showEditModal: true, editActivity: item });
  }

  submitEditActivity = (event, state) => {
    //build object to save
    let activity = {};
    activity.Title = state.Title;
    activity.WeekOf = moment(state.InputWeekOf).day(0).toISOString();
    activity.Branch = state.Branch;
    activity.InterestItems = state.InterestItems;
    activity.ActionItems = state.ActionItems;
    activity.TextOPRs = state.TextOPRs; //TODO convert to peopler picker format...

    let activityList = this.web.lists.getByTitle("Activities");

    //determine if new or edit
    this.setState({ isLoading: true });
    if (state.ID !== -1) {
      //EDIT existing item
      console.log(`Submitting updated item ${activity.Title}!`);
      //TODO Include ETag checks/handling
      if (process.env.NODE_ENV === 'development') {
        let listData = this.state.listData;
        const itemIndex = listData.findIndex(item => item.ID === state.ID);
        const item = { ...listData[itemIndex], ...activity }; //merge objects
        listData[itemIndex] = item;
        this.setState({ isLoading: false, showEditModal: false, saveError: false, listData });
      } else {
        activityList.items.getById(state.ID).update(activity)
          .then(r => {
            //Note: .update() returns the new ETag, but not the rest of the data
            let listData = this.state.listData;
            const itemIndex = listData.findIndex(item => item.ID === state.ID);
            const item = { ...listData[itemIndex], ...activity }; //merge objects
            listData[itemIndex] = item;
            this.setState({ isLoading: false, showEditModal: false, saveError: false, listData });
          }, e => {
            console.error(e);
            this.setState({ saveError: true, isLoading: false });
          });
      }
    } else {
      //NEW item to be created
      console.log(`Submitting new item ${activity.Title}!`);
      let listData = this.state.listData;
      if (process.env.NODE_ENV === 'development') {
        activity.ID = Math.max.apply(Math, listData.map(o => { return o.ID })) + 1;
        ActivityDev.AddDevActivity(activity).then(() => {
          if (this.state.saveError) {
            listData.push(activity);
            this.setState({ isLoading: false, saveError: false, showEditModal: false, listData });
          } else {
            this.setState({ isLoading: false, saveError: true });
          }
        });
      } else {
        activityList.items.add(activity)
          .then(r => {
            listData.push(r.data);
            this.setState({ isLoading: false, saveError: false, showEditModal: false, listData });
          }, e => {
            console.error(e);
            this.setState({ saveError: true, isLoading: false });
          });
      }
    }
  }

  addNewWeeks(numWeeks, weekStart) {
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

  cardOnClick = (action) => {
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
          submitEditActivity={this.submitEditActivity}
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
