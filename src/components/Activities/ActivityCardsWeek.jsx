import React, { Component } from 'react';
import { Card, Col } from 'react-bootstrap';

class ActivityCardsWeek extends Component {
    render() {
        const actions = this.props.actions;
        return (
            actions.length ?
            actions.map((action, index) => (
                <Col xl={6} className="mb-3" key={action.ID}>
                    <Card className="activity"
                        onClick={() => this.props.onClick(action)}>
                        <Card.Body>
                            <Card.Title>Activity/Purpose: <span ref="Title">{action.Title}</span></Card.Title>
                            <Card.Text as="div">
                                <strong>Specific items of interest:</strong> <span style={{whiteSpace: 'pre-line'}} ref="InterestItems">{action.InterestItems}</span><br />
                                <strong>Action items for {action.Branch}:</strong> <span ref="ActionItems">{action.ActionItems}</span><br />
                                <strong>OPRs:</strong> <span >{action.TextOPRs}</span>
                                {//TODO Change to people picker
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )) 
            : <Col>You have no saved items for this period of accomplishment.</Col>);
    }
}

export default ActivityCardsWeek;