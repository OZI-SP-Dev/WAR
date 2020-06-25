import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import Report from './Report';
import DateUtilities from '../../utilities/DateUtilities';

class WeeklyReport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingReport: false,
            errorMessage: "",
            activities: [],
            reportGenerated: false
        }

        this.activitiesApi = ActivitiesApiConfig.activitiesApi;
    }

    async submitSearch(startDate, endDate) {
        this.setState({ loadingReport: true });
        let submitEndDate = DateUtilities.getDate(endDate).add(1, 'day');
        try {
            let items = await this.activitiesApi.fetchActivitiesByDates(startDate, submitEndDate, null, null, "WeekOf");
            let results = items.results;
            while (items.hasNext) {
                items = await items.getNext();
                results = results.concat(items.results);
            }
            this.setState({ loadingReport: false, activities: results, reportGenerated: true });
            $(".report-toggle").click();
        } catch (e) {
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch WAR Activities. ${e}`, reportGenerated: true });
        }
    }

    render() {
        return (
            <Report
                pageHeader="Weekly Activity Report"
                searchCardHeader="Weekly Report Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
                reportGenerated={this.state.reportGenerated}
            />
        );
    }
}

export default WeeklyReport;