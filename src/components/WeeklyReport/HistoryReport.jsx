import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import Report from './Report';

class HistoryReport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingReport: false,
            errorMessage: "",
            activities: []
        }

        this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    }

    submitSearch(startDate, endDate) {
        this.setState({ loadingReport: true });
        let submitEndDate = new Date(endDate);
        submitEndDate.setDate(endDate.getDate() + 1);
        this.activitiesApi.fetchHistoryEntriesByDates(startDate, submitEndDate).then(r => {
            this.setState({ loadingReport: false, activities: r });
            $(".report-toggle").click();
        }, e =>
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch History Entries. ${e}` })
        );
    }

    render() {
        return (
            <Report
                pageHeader="Historical Report"
                searchCardHeader="History Entries Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
            />
        );
    }
}

export default HistoryReport;