import React, { Component } from 'react';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ActivityCard } from './ActivityCard';

class ActivityCardsWeek extends Component {
	render() {
		const actions = this.props.actions;
		return (
			actions.length ?
				actions.map((activity) => (
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
									onClick={this.props.onClick}
									copyOnClick={this.props.copyOnClick}
								/>
							</span>
						</OverlayTrigger>
					</Col>
				))
				: <Col>You have no saved items for this period of accomplishment.</Col>);
	}
}

export default ActivityCardsWeek;