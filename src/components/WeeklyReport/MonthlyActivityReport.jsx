import $ from 'jquery';
import React, { Component } from 'react';
import { ActivitiesApiConfig } from '../../api/ActivitiesApi';
import DateUtilities from '../../utilities/DateUtilities';
import Report from './Report';
import ReportActivitiesByParent from './ReportActivitiesByParent';

class MonthlyActivityReport extends Component {

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
            let items = await this.activitiesApi.fetchMarEntriesByDates(startDate, submitEndDate, null, "Branch");
            let activities = items.results;
            while (items.hasNext) {
                items = await items.getNext();
                activities = activities.concat(items.results);
            }
            this.setState({ loadingReport: false, activities, reportGenerated: true });
            $(".report-toggle").click();
        } catch (e) {
            this.setState({ loadingReport: false, errorMessage: `Error while trying to fetch MAR Activities. ${e}`, reportGenerated: true })
        }
    }

    render() {
        return (
            <div className="monthly-activity-report">
                <Report
                    pageHeader="Monthly Activity Report"
                    searchCardHeader="MAR Search"
                    submitSearch={(startDate, endDate) => this.submitSearch(startDate, endDate)}
                    loadingReport={this.state.loadingReport}
                    reportGenerated={this.state.reportGenerated}
                >
                    <ReportActivitiesByParent
                        activities={this.state.activities}
                        reportGenerated={this.state.reportGenerated}
                        hideWeekOf
                    />
                </Report>
            </div>
        );
    }
}

export default MonthlyActivityReport;