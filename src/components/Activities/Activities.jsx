import moment from 'moment';
import React, { Component } from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import RoleUtilities from '../../utilities/RoleUtilities';
import './Activities.css';
import ActivityAccordion from './ActivityAccordion';
import EditActivityModal from './EditActivityModal';
import { spWebContext } from '../../providers/SPWebContext';
import "@pnp/sp/site-users/web";

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
			text: this.props.user.Title,
			imageInitials: this.props.user.Title.substr(this.props.user.Title.indexOf(' ') + 1, 1) + this.props.user.Title.substr(0, 1),
			SPUserId: this.props.user.Id
		}
  }

  componentDidMount() {
		this.setState({ minCreateDate: RoleUtilities.getMinActivityCreateDate(this.props.user) });
		this.fetchItems(4, DateUtilities.getStartOfWeek(new Date()));
	}
	
	convertOPRsToPersonas = (OPRs) => {
		let newOPRs = [];
		if (OPRs.results) {
			newOPRs = OPRs.results.map(OPR => {
				return {
					text: OPR.Title,
					imageInitials: OPR.Title.substr(OPR.Title.indexOf(' ') + 1, 1) + OPR.Title.substr(0, 1),
					SPUserId: OPR.Id
				}
			})
		}
		return newOPRs;
	}

  fetchItems = (numWeeks, weekStart) => {
		this.activitiesApi.fetchActivitiesByNumWeeks(numWeeks, weekStart, this.props.user.Id).then(r => {
			r.forEach(activity => {
				activity.OPRs = this.convertOPRsToPersonas(activity.OPRs);
			})
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
			Branch: 'OZIC', ActionTaken: '', IsBigRock: false, IsHistoryEntry: false, OPRs: [this.Me]
    }
    this.setState({ showEditModal: true, editActivity: item });
  }

	buildActivity = async (activity) => {
		let builtActivity = {
			ID: activity.ID,
			Title: activity.Title,
			WeekOf: moment(activity.InputWeekOf).day(0).toISOString(),
			Branch: activity.Branch,
			ActionTaken: activity.ActionTaken,
			IsBigRock: activity.IsBigRock,
			IsHistoryEntry: activity.IsHistoryEntry,
			OPRsId: { results: [] }
		};

		//Fetch Id's for new OPRs
		let userIdPromises = activity.OPRs.map(async (OPR) => {
			if (OPR.SPUserId) {
				return OPR.SPUserId;
			} else if (OPR.Email) {
				let ensuredUser = await spWebContext.ensureUser(OPR.Email);
				return ensuredUser.data.Id;
			}
		});

		//wait for all UserIds to be fetched
		await Promise.all(userIdPromises).then(OPRsId => {
			builtActivity.OPRsId.results = OPRsId;
		});
		return builtActivity;
  }

  submitActivity = async (event, newActivity) => {
    this.setState({ isLoading: true });
    //build object to save
    let activityToSubmit = await this.buildActivity(newActivity);

    // Remove trailing period(s) from Title
    while (activityToSubmit.Title.charAt(activityToSubmit.Title.length - 1) === '.') {
      activityToSubmit.Title = activityToSubmit.Title.slice(0, -1);
    }

		this.activitiesApi.submitActivity(activityToSubmit).then(r => {
			newActivity.ID = r.data.ID;
			newActivity.WeekOf = r.data.WeekOf;

			//newActivity.etag = r.data.__metadata.etag; // etag location for new items

			// rather than filter out the old activity, update if it already existed
			// this prevents the activity display from re-ordering the existing items
			let activityList = [...this.state.listData];
			if (activityToSubmit.ID > 0) {
				activityList = activityList.map(item => {
					if (item.ID === activityToSubmit.ID) {
						item = newActivity;
					}
					return item;
				})
			} else {
				activityList.push(newActivity);
			}
      this.setState({ isLoading: false, showEditModal: false, saveError: false, listData: activityList });
    }, e => {
      console.error(e);
      this.setState({ saveError: true, isLoading: false });
    });
  }

  deleteActivity = async (activity) => {
    this.setState({ isDeleting: true })
    this.activitiesApi.deleteActivity(await this.buildActivity(activity))
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
          showBigRockCheck={(org) => RoleUtilities.userCanSetBigRock(this.props.user, org)}
          showHistoryCheck={(org) => RoleUtilities.userCanSetHistory(this.props.user, org)}
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
