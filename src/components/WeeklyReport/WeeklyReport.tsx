import $ from 'jquery';
import { Moment } from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivitiesApiConfig, IActivity } from '../../api/ActivitiesApi';
import { spWebContext } from '../../providers/SPWebContext';
import DateUtilities from '../../utilities/DateUtilities';
import RoleUtilities, { IUserRole } from '../../utilities/RoleUtilities';
import { useQuery } from '../Review/Review';
import { Report } from './Report';
import ReportActivitiesByBranch from './ReportActivitiesByBranch';

export interface IWeeklyReportProps {
    user: IUserRole
}

export const WeeklyReport: FunctionComponent<IWeeklyReportProps> = ({ user }) => {

    let query = useQuery();
    let defaultQuery = query.getParamOrDefaultString(query.params.get("query"), '', '');
    let defaultOrg = query.getParamOrDefaultString(query.params.get("org"), RoleUtilities.getReviewDefaultOrg(user), '');
    let defaultIncludeSubOrgs = query.getParamOrDefaultBoolean(query.params.get("includeSubOrgs"), true);
    let defaultStartDate = query.getParamOrDefaultDateTime(query.params.get("startDate"), DateUtilities.getToday().day() >= 3
        ? DateUtilities.getStartOfWeek() : DateUtilities.getStartOfWeek().subtract(7, 'days'));
    let defaultEndDate = query.getParamOrDefaultDateTime(query.params.get("endDate"), DateUtilities.getDate(defaultStartDate).endOf('week'));
    let defaultOpr = query.getParamOrDefaultString(query.params.get("opr"), !RoleUtilities.userHasAnyRole(user) ? user.Email : '', '');

    const [loadingReport, setLoadingReport] = useState(false);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    const history = useHistory();
    const activitiesApi = ActivitiesApiConfig.activitiesApi;

    const submitSearch = async (keyword: string, startDate: Moment | null, endDate: Moment | null, org: string, includeSubOrgs: boolean, oprEmail: string) => {
        history.push(`/WAR?query=${keyword}&org=${org}&includeSubOrgs=${includeSubOrgs}&startDate=${startDate ? startDate.toISOString() : ''}&endDate=${endDate ? endDate.toISOString() : ''}&opr=${oprEmail}`);
        setLoadingReport(true);
    }

    useEffect(() => {
        // load the report when loadingReport is set to true, this avoids an async issue with the fetch not getting the new URL params in time
        if (loadingReport) {
            fetchActivities();
        }
        // eslint-disable-next-line
    }, [loadingReport]);

    const fetchActivities = async () => {
        try {
            let submitUserId = defaultOpr ? (await spWebContext.ensureUser(defaultOpr)).data.Id : undefined;
            let newActivities: any[] = await activitiesApi.fetchActivitiesByQueryString(defaultQuery, defaultOrg, defaultIncludeSubOrgs, defaultStartDate, defaultEndDate, undefined, undefined, submitUserId);
            setActivities(newActivities);
            setLoadingReport(false);
            setReportGenerated(true);
            $(".report-toggle").trigger('click');
        } catch (e) {
            console.error(e);
            setLoadingReport(false);
            setReportGenerated(true);
        }
    }

    return (
        <Report
            pageHeader="Weekly Activity Report"
            searchCardHeader="Weekly Report Search"
            submitSearch={submitSearch}
            defaultQuery={defaultQuery}
            defaultOrg={defaultOrg}
            defaultIncludeSubOrgs={defaultIncludeSubOrgs}
            defaultStartDate={defaultStartDate}
            defaultEndDate={defaultEndDate}
            defaultOpr={defaultOpr}
            loadingReport={loadingReport}
        >
            <ReportActivitiesByBranch
                activities={activities}
                reportGenerated={reportGenerated}
            />
        </Report>
    );
}