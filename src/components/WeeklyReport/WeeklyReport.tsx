import $ from 'jquery';
import { Moment } from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivitiesApiConfig, IActivity } from '../../api/ActivitiesApi';
import { spWebContext } from '../../providers/SPWebContext';
import DateUtilities from '../../utilities/DateUtilities';
import { useQuery } from '../Review/Review';
import { Report } from './Report';
import ReportActivitiesByBranch from './ReportActivitiesByBranch';

export const WeeklyReport: FunctionComponent = () => {

    let query = useQuery();
    let urlQuery = query.params.get("query");
    let urlOrg = query.params.get("org");
    let urlIncludeSubOrgs = query.params.get("includeSubOrgs");
    let urlStartDate = query.params.get("startDate");
    let urlEndDate = query.params.get("endDate");
    let urlOpr = query.params.get("opr");

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
            let submitQuery = urlQuery ? urlQuery : '';
            let submitOrg = urlOrg ? urlOrg.replace('--', '') : undefined;
            let submitIncludeSubOrgs = urlIncludeSubOrgs === "true" ? true : false;
            let submitStartDate = undefined;
            if (urlStartDate) {
                submitStartDate = DateUtilities.getDate(urlStartDate).subtract(1, 'day');
            }
            let submitEndDate = urlEndDate ? DateUtilities.getStartOfWeek(urlEndDate) : undefined;
            let submitUserId = urlOpr ? (await spWebContext.ensureUser(urlOpr)).data.Id : undefined;
            let newActivities: any[] = await activitiesApi.fetchActivitiesByQueryString(submitQuery, submitOrg, submitIncludeSubOrgs, submitStartDate, submitEndDate, undefined, undefined, submitUserId);
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
            defaultQuery={urlQuery ? urlQuery : ''}
            defaultOrg={urlOrg ? urlOrg : ''}
            defaultIncludeSubOrgs={urlIncludeSubOrgs === "true" ? true : false}
            defaultStartDate={urlStartDate ? DateUtilities.getDate(urlStartDate) : null}
            defaultEndDate={urlEndDate ? DateUtilities.getDate(urlEndDate) : null}
            defaultOpr={urlOpr ? urlOpr : null}
            loadingReport={loadingReport}
        >
            <ReportActivitiesByBranch
                activities={activities}
                reportGenerated={reportGenerated}
            />
        </Report>
    );
}