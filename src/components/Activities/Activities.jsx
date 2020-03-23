import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { spWebContext } from '../../providers/SPWebContext';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
import EditActivityModal from './EditActivityModal';
import testData from './testData/activities.json'

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isLoading: true,
      showAddModal: false,
      showDeleteModal: false,
      deleteItemId: -1,
      showEditModal: false,
      editActivity: {},
      editItemID: -1,
      loadedWeeks: []
    };
    this.web = spWebContext;
    // set up the initial weeks that we will use to pull activity data
    let today = new Date();
    this.addNewWeeks(4, new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay(), 0, 0, 0, 0));
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    this.setState({ isLoading: true });
    if (process.env.NODE_ENV === 'development') {
      // Emulate a "long" web call so we can watch the spinners
      setTimeout(() => {
        let listData = testData.activities;
        this.setState({ isLoading: false, listData })
      }, // end of arrow function
        3000); // timeout duration
    } else {
      this.web.lists.getByTitle("Activities").items.filter(`WeekOf ge '${this.state.loadedWeeks[this.state.loadedWeeks.length-1].toISOString()}' and WeekOf le '${this.state.loadedWeeks[0].toISOString()}'`).get().then(r => {
        console.log(r);
        this.setState({ isLoading: false, listData: r });
      }, e => {
        console.error(e);
        this.setState({ isLoading: false });
      });
    }
  }

  /*saveItem = ID => {
    // do some saving here
    let listData = this.state.listData;
    let itemIndex = listData.findIndex(item => item.ID === ID);
    let item = listData[itemIndex];
    item.Title = 'New Title';
    item.InterestItems = 'New Interests';
    item.ActionItems = 'New Actions!';
    listData[itemIndex] = item;
    if (ID === 'New') {
      item.ID = this.state.newID;
      // Probably not thread safe - just for easy testing
      this.setState({ listData, newItem: false, newID: item.ID + 1 });
    }
    this.setState({ listData });
  };*/

  deleteItem = ID => {
    // delete operation to remove item
    let newData = this.state.listData.filter(el => el.ID !== ID);
    this.setState({ listData: newData });
  }

  newItem = () => {
    let today = new Date();
    let inputWeekOf = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay(), 0, 0, 0, 0);
    inputWeekOf = inputWeekOf.toISOString().split('T',1)[0];
    console.log(inputWeekOf);
   
    let item = {
      ID: -1, Title: 'New Item', WeekOf: '2020-03-08T06:00:00Z', InputWeekOf: inputWeekOf, Branch: 'OZI',
      InterestItems: 'Items of interest...',
      ActionItems: 'Informational.', OPRs: this.props.user.data
    }

    this.setState({ showEditModal: true, editActivity: item });
  }

  submitEditActivity = (event, state) => {
    //build object to save
    let activity = {};
    activity.Title = state.Title;
    activity.WeekOf = state.inputWeekOf;
    activity.Branch = state.Branch;
    activity.InterestItems = state.InterestItems;
    activity.ActionItems = state.ActionItems;
    
    //activity.OPRs = ; //convert to peopler picker format... skipping for now
    
    //TODO set loading
    let list = this.web.lists.getByTitle("Activities");

    //determine if new or edit
    if (state.ID !== -1) {
      //EDIT
      console.log(`Submitting updated item ${this.state.Title}!`);
      list.items.getById(state.ID).update(activity)
        .then(r => {
          console.log(r);
          let listData = this.state.listData;
          let itemIndex = listData.findIndex(item => item.ID === this.state.ID);
          listData[itemIndex] = r;
          this.setState({listData});
          
        }, e => {
          console.error(e);
          activity.ID = this.state.ID;
          let listData = this.state.listData;
          let itemIndex = listData.findIndex(item => item.ID === this.state.ID);
          activity.ID = this.state.ID;
          listData[itemIndex] = activity;          
          this.setState({activity});
        });
    } else {
      //NEW

    }
    
    //catch errors
    //clear modal
    //clear loading
    event.persist();
    console.log(state);
    this.setState({ showEditModal: false });
  }

  addNewWeeks(numWeeks, weekStart) {
    let newWeeks = this.state.loadedWeeks;
    for (let i = 0; i < numWeeks; ++i) {
      let week = new Date(weekStart);
      week.setDate(weekStart.getDate() - (7 * i));
      newWeeks.push(week);
    }
    this.setState({loadedWeeks: newWeeks});
  }

  loadMoreWeeks = () => {
    let lastWeekLoaded = this.state.loadedWeeks[this.state.loadedWeeks.length - 1];
    let nextWeekStart = new Date(lastWeekLoaded);
    nextWeekStart.setDate(lastWeekLoaded.getDate() - 7);
    this.addNewWeeks(4, nextWeekStart);
    this.fetchItems();
  }

  closeEditActivity = () => {
    this.setState({ showEditModal: false });
  }

  cardOnClick = (action) => {
    const editActivity = action;
    editActivity.InputWeekOf = editActivity.WeekOf.split('T',1)[0];
    this.setState({ showEditModal: true, editActivity });
  }

  render() {
    const { isLoading } = this.state;
    const MySpinner = () =>
      <div className="spinner">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
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
        />
        <Row className="justify-content-center"><h1>My Items</h1></Row>
        {this.state.loadedWeeks.map(date => 
          <ActivityAccordion 
            key={date}
            weekOf={date} 
            actions={this.state.listData} 
            disableNewButton={this.state.newItem} 
            newButtonOnClick={() => this.newItem()} 
            cardOnClick={(action) => this.cardOnClick(action)}
          />)}
        <Button className="float-right mb-3" variant="primary" onClick={this.loadMoreWeeks}>Load More Activities</Button>
        {isLoading && <MySpinner />}
      </Container>
    );
  }
}

export default Activities;
