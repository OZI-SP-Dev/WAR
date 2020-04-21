import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import Report from './Report';

class BigRocksReport extends Component {

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
        this.activitiesApi.fetchBigRocksByDates(startDate, submitEndDate).then(r => {
            this.setState({ loadingReport: false, activities: r });
            $(".report-toggle").click();
        }, e =>
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch Big Rock Activities. ${e}` })
        );
    }

    render() {
        return (
            <Report
                pageHeader="Big Rocks Report"
                searchCardHeader="Big Rocks Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
            />
        );
    }
}

export default BigRocksReport;