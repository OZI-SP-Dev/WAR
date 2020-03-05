import React, { Component } from 'react';
import { Card, Col } from 'react-bootstrap';

class ActivityCardsWeek extends Component {

    datesAreEqual(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }

    render() {
        return (
            this.props.actions.filter(action => this.datesAreEqual(action.WeekOf, this.props.weekStart)).map((action, index) => (
                <Col xl={6} className="mb-3" key={action.ID}>
                    <Card className="activity">
                        <Card.Body>
                            <Card.Title>Activity/Purpose: <span ref="Title">{action.Title}</span></Card.Title>
                            <Card.Text>
                                <strong>Specific items of interest:</strong> <span ref="InterestItems">{action.InterestItems}</span><br />
                                <strong>Action items for {action.Branch}:</strong> <span ref="ActionItems">{action.ActionItems}</span><br />
                                <strong>OPRs:</strong> <span >{action.OPRs}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )));
    }

}