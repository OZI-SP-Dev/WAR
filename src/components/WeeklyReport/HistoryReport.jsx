import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
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

    async submitSearch(startDate, endDate) {
        this.setState({ loadingReport: true });
        let submitEndDate = DateUtilities.getDate(endDate).add(1, 'day');
        try {
            let items = await this.activitiesApi.fetchHistoryEntriesByDates(startDate, submitEndDate, null, "WeekOf");
            let activities = items.results;
            while (items.hasNext) {
                items = await items.getNext();
                activities = activities.concat(items.results);
            }
            this.setState({ loadingReport: false, activities, reportGenerated: true });
            $(".report-toggle").click();
        } catch (e) {
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch History Entries. ${e}`, reportGenerated: true })
        }
    }

    render() {
        return (
            <Report
                pageHeader="Historical Report"
                searchCardHeader="History Entries Search"
                submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                loadingReport={this.state.loadingReport}
                activities={this.state.activities}
                reportGenerated={this.state.reportGenerated}
            />
        );
    }
}

export default HistoryReport;