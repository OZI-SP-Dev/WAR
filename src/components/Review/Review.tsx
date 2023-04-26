import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ActivitiesApiConfig, IActivity } from "../../api/ActivitiesApi";
import { OrgsContext } from "../../providers/OrgsContext";
import { spWebContext } from "../../providers/SPWebContext";
import ActivityUtilities from "../../utilities/ActivityUtilities";
import DateUtilities from "../../utilities/DateUtilities";
import RoleUtilities, { IUserRole } from "../../utilities/RoleUtilities";
import "../Activities/Activities.css";
import { ActivityCard } from "../Activities/ActivityCard";
import ActivitySpinner from "../Activities/ActivitySpinner";
import EditActivityModal from "../Activities/EditActivityModal";
import CardAccordion from "../CardAccordion/CardAccordion";
import { CustomToggleAccordion } from "../CustomToggleAccordion/CustomToggleAccordion";
import { SearchForm } from "./SearchForm";

export function useQuery(): {
  params: URLSearchParams;
  getParamOrDefaultString: (
    param: string | null,
    nullDefaultValue: string,
    blankDefaultValue?: string
  ) => any;
  getParamOrDefaultDateTime: (
    param: string | null,
    nullDefaultValue: Moment,
    blankDefaultValue?: Moment
  ) => any;
  getParamOrDefaultBoolean: (
    param: "true" | "false" | string | null,
    nullDefaultValue: boolean,
    blankDefaultValue?: any
  ) => boolean;
} {
  return {
    params: new URLSearchParams(useLocation().search),
    getParamOrDefaultString: (
      param: any,
      nullDefaultValue: string,
      blankDefaultValue?: string
    ) =>
      param === null ? nullDefaultValue : param ? param : blankDefaultValue,
    getParamOrDefaultDateTime: (
      param: string | null,
      nullDefaultValue: Moment,
      blankDefaultValue?: Moment
    ) =>
      param === null
        ? nullDefaultValue
        : param
        ? DateUtilities.getDate(param)
        : blankDefaultValue,
    getParamOrDefaultBoolean: (
      param: "true" | "false" | string | null,
      nullDefaultValue: boolean
    ) => (param === null ? nullDefaultValue : param === "true" ? true : false),
  };
}

export interface IReviewProps {
  user: IUserRole;
}

interface GroupedActivities {
  week: string;
  activitiesByOrg: {
    org: string;
    activities: any[];
  }[];
}

export const Review: React.FunctionComponent<IReviewProps> = ({ user }) => {
  let query = useQuery();

  let urlQuery = query.params.get("query");
  let urlOrg = query.params.get("org");
  let urlIncludeSubOrgs = query.params.get("includeSubOrgs");
  let urlStartDate = query.params.get("startDate");
  let urlEndDate = query.params.get("endDate");
  let urlIsHistory = query.params.get("isHistory");
  let urlIsMAR = query.params.get("isMAR");
  let urlOpr = query.params.get("opr");

  let defaultQuery = query.getParamOrDefaultString(urlQuery, "", "");
  let defaultOrg = query.getParamOrDefaultString(
    urlOrg,
    RoleUtilities.getReviewDefaultOrg(user),
    ""
  );
  let defaultIncludeSubOrgs = query.getParamOrDefaultBoolean(
    urlIncludeSubOrgs,
    true
  );
  let defaultStartDate = query.getParamOrDefaultDateTime(
    urlStartDate,
    DateUtilities.getToday().day() >= 3
      ? DateUtilities.getStartOfWeek()
      : DateUtilities.getStartOfWeek().subtract(7, "days")
  );
  let defaultEndDate = query.getParamOrDefaultDateTime(
    urlEndDate,
    DateUtilities.getDate(defaultStartDate).endOf("week")
  );
  let defaultIsHistory = query.getParamOrDefaultBoolean(urlIsHistory, false);
  let defaultIsMAR = query.getParamOrDefaultBoolean(urlIsMAR, false);
  let defaultOpr = query.getParamOrDefaultString(
    urlOpr,
    !RoleUtilities.userHasAnyRole(user) ? user.Email : "",
    ""
  );

  const [activities, setActivities] = useState<GroupedActivities[]>([]);
  const [modalActivityId, setModalActivityId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [activeEventKey, setActiveEventKey] = useState("");

  const activitiesApi = ActivitiesApiConfig.activitiesApi;

  const { orgs } = useContext(OrgsContext);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let submitUserId = defaultOpr
        ? (await spWebContext.ensureUser(defaultOpr)).data.Id
        : undefined;
      let newActivities: any[] =
        await activitiesApi.fetchActivitiesByQueryString(
          defaultQuery,
          defaultOrg,
          defaultIncludeSubOrgs,
          defaultStartDate,
          defaultEndDate,
          defaultIsHistory,
          defaultIsMAR,
          submitUserId
        );
      setActivities(groupActivities(newActivities));
      setLoading(false);
      setActiveEventKey("");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const groupActivities = (newActivities: any[]): GroupedActivities[] => {
    let newGroupedActivites: GroupedActivities[] = [];
    newActivities.forEach((activity: any) => {
      let week = DateUtilities.getDate(activity.WeekOf).toISOString();
      let activitiesWeek: GroupedActivities | undefined =
        newGroupedActivites.find((act) => act.week === week);
      if (activitiesWeek) {
        let activitiesByOrg = activitiesWeek.activitiesByOrg.find(
          (actByOrg) => actByOrg.org === activity.Branch
        );
        activitiesByOrg?.activities.push(activity);
      } else {
        activitiesWeek = {
          week,
          activitiesByOrg: (orgs ? orgs : []).map((org) => {
            return {
              org,
              activities: activity.Branch === org ? [activity] : [],
            };
          }),
        };
        newGroupedActivites.push(activitiesWeek);
      }
    });
    newGroupedActivites.sort((ga1, ga2) => {
      let date1 = moment(ga1.week);
      let date2 = moment(ga2.week);
      return date1.isBefore(date2) ? 1 : date1.isAfter(date2) ? -1 : 0;
    });
    return newGroupedActivites;
  };

  const getAllActivities = () => {
    let allActivities: any[] = [];
    activities.forEach((activitiesByWeek) => {
      activitiesByWeek.activitiesByOrg.forEach((activitiesByOrg) => {
        activitiesByOrg.activities.forEach((activity) =>
          allActivities.push(activity)
        );
      });
    });
    return allActivities;
  };

  const submitActivity = async (activity: any) => {
    try {
      setLoading(true);
      let builtActivity = await ActivityUtilities.buildActivity(activity);

      let response = await activitiesApi.submitActivity(builtActivity);

      builtActivity = ActivityUtilities.updateActivityEtagFromResponse(
        response,
        activity,
        builtActivity
      );

      setActivities(
        groupActivities(
          ActivityUtilities.replaceActivity(getAllActivities(), builtActivity)
        )
      );
      setLoading(false);
      setModalActivityId(-1);
    } catch (e) {
      console.error(e);
      setError(true);
      setLoading(false);
    }
  };

  const deleteActivity = async (activity: any) => {
    try {
      setDeleting(true);
      await activitiesApi.deleteActivity(
        await ActivityUtilities.buildActivity(activity)
      );
      setActivities(
        groupActivities(
          ActivityUtilities.filterActivity(getAllActivities(), activity)
        )
      );
      setDeleting(false);
      setModalActivityId(-1);
    } catch (e) {
      console.error(e);
      setError(true);
      setDeleting(false);
      setModalActivityId(-1);
    }
  };

  const closeModal = () => {
    setModalActivityId(-1);
  };

  const cardOnClick = (activity: any) => {
    setModalActivityId(activity.Id);
  };

  const isOrgDisplayed = (org: string) => {
    return (
      !defaultOrg ||
      defaultOrg === org ||
      (defaultIncludeSubOrgs && org.includes(defaultOrg))
    );
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [
    urlQuery,
    urlOrg,
    urlIncludeSubOrgs,
    urlStartDate,
    urlEndDate,
    urlIsHistory,
    urlIsMAR,
    urlOpr,
  ]);

  return (
    <Container fluid>
      <Row className="justify-content-center m-3">
        <h1>
          {defaultQuery === null ? "Review Activities" : "Search Results"}
        </h1>
      </Row>
      <CardAccordion
        activeEventKey={activeEventKey}
        setActiveEventKey={setActiveEventKey}
        cardHeader="Search and Filter"
      >
        <SearchForm
          defaultQuery={defaultQuery}
          defaultOrg={defaultOrg}
          defaultIncludeSubOrgs={defaultIncludeSubOrgs}
          defaultStartDate={
            defaultStartDate
              ? DateUtilities.getDate(defaultStartDate)
              : undefined
          }
          defaultEndDate={
            defaultEndDate ? DateUtilities.getDate(defaultEndDate) : undefined
          }
          defaultIsHistory={defaultIsHistory}
          defaultIsMAR={defaultIsMAR}
          defaultOpr={defaultOpr ? defaultOpr : null}
          loading={loading}
          orgs={orgs ? orgs : []}
        />
      </CardAccordion>
      {activities.map((activitiesForWeek) => (
        <CustomToggleAccordion
          key={activitiesForWeek.week + "_acc"}
          className="mb-3"
          header={`Week of: ${DateUtilities.getDate(
            activitiesForWeek.week
          ).format("DD MMM YYYY")}`}
          as={"h4"}
        >
          <div key={activitiesForWeek.week + "_div"}>
            {activitiesForWeek.activitiesByOrg
              .filter((actByOrg) => isOrgDisplayed(actByOrg.org))
              .map((activitiesForOrg) => (
                <CustomToggleAccordion
                  key={activitiesForWeek.week + activitiesForOrg.org + "_acc"}
                  defaultOpen={activitiesForOrg.activities.length > 0}
                  badge={`${activitiesForOrg.activities.length}`}
                  className="mb-3"
                  header={`Organization: ${activitiesForOrg.org}`}
                  as={"h6"}
                  headerClassName="ml-3"
                >
                  <div
                    key={activitiesForWeek.week + activitiesForOrg.org + "_div"}
                  >
                    {activitiesForOrg.activities.length > 0 ? (
                      activitiesForOrg.activities.map((activity) => (
                        <div key={`${activity.Id}_div`}>
                          <ActivityCard
                            className={"mb-3"}
                            key={`${activity.Id}_card`}
                            activity={activity}
                            onClick={cardOnClick}
                          />
                          <EditActivityModal
                            key={`${activity.Id}_modal`}
                            showEditModal={modalActivityId === activity.Id}
                            submitEditActivity={submitActivity}
                            handleDelete={deleteActivity}
                            closeEditActivity={closeModal}
                            activity={activity}
                            deleting={deleting}
                            saving={loading}
                            error={error}
                            canEdit={(act: IActivity) =>
                              RoleUtilities.isActivityEditable(act, user)
                            }
                            minCreateDate={RoleUtilities.getMinActivityCreateDate(
                              user
                            )}
                            showMarCheck={(org: string) =>
                              RoleUtilities.userCanSetMar(user, org)
                            }
                            showHistoryCheck={(org: string) =>
                              RoleUtilities.userCanSetHistory(user, org)
                            }
                            userIsOrgChief={(org: string) =>
                              RoleUtilities.userIsBranchChiefOrHigher(user, org)
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <Card className="text-center">
                        <span>
                          {`There were no activities found for ${
                            activitiesForOrg.org
                          } in the week of ${DateUtilities.getDate(
                            activitiesForWeek.week
                          ).format("DD MMM YYYY")}`}
                        </span>
                      </Card>
                    )}
                  </div>
                </CustomToggleAccordion>
              ))}
          </div>
        </CustomToggleAccordion>
      ))}
      <ActivitySpinner show={loading} displayText="Fetching Activities" />
    </Container>
  );
};
