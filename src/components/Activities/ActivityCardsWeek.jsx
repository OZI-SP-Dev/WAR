import React, { Component } from 'react';
import { Card, Col } from 'react-bootstrap';

class ActivityCardsWeek extends Component {
    render() {
        const actions = this.props.actions;
        return (
            actions.length ?
            actions.map((action, index) => (
                <Col xl={6} className="mb-3" key={action.Id}>
                    <Card className="activity"
                        onClick={() => this.props.onClick(action)}>
                        <Card.Body>
                            <Card.Title>Activity/Purpose: <span ref="Title">{action.Title}</span></Card.Title>
                            <Card.Text as="div">
                                <strong>Action Taken/In Work</strong> <span style={{whiteSpace: 'pre-line'}} ref="InterestItems">{action.ActionTaken}</span><br />
                                <strong>Branch: </strong><span>{action.Branch}</span><br />
                                <strong>OPRs:</strong> {action.OPRs && action.OPRs.map((OPR) =>
																	(<span key={ OPR.SPUserId }> { OPR.text }; </span>))}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )) 
            : <Col>You have no saved items for this period of accomplishment.</Col>);
    }
}

export default ActivityCardsWeek;