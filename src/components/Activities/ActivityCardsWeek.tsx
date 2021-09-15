import React from 'react';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IActivity } from '../../api/ActivitiesApi';
import { ActivityCard } from './ActivityCard';

export interface IActivityCardsWeekProps {
	activities: IActivity[],
	onClick: (activity: IActivity) => void,
	copyOnClick: (activity: IActivity) => void
}

export const ActivityCardsWeek: React.FunctionComponent<IActivityCardsWeekProps> = (props: IActivityCardsWeekProps) => {

	return (
		<> {
			props.activities.length ?
				props.activities.map((activity) => (
					<Col xl={6} className="mb-3" key={activity.Id}>
						<OverlayTrigger
							delay={{ show: 500, hide: 0 }}
							overlay={
								<Tooltip id={"activityTooltip" + activity.Id}>
									Click to edit.
								</Tooltip>
							}
						>
							<span>
								<ActivityCard
									activity={activity}
									onClick={props.onClick}
									copyOnClick={props.copyOnClick}
								/>
							</span>
						</OverlayTrigger>
					</Col>
				))
				: <Col>You have no saved items for this period of accomplishment.</Col>
		} </>
	);
}

export default ActivityCardsWeek;