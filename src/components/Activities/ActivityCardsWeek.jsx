import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { ActivityCard } from './ActivityCard';

class ActivityCardsWeek extends Component {
    render() {
        const actions = this.props.actions;
        return (
            actions.length ?
                actions.map((activity) => (
                    <Col xl={6} className="mb-3" key={activity.Id}>
                        <ActivityCard
                            activity={activity}
                            onClick={this.props.onClick}
                        />
                    </Col>
                ))
                : <Col>You have no saved items for this period of accomplishment.</Col>);
    }
}

export default ActivityCardsWeek;