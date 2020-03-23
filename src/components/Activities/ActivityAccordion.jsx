import React, { Component } from 'react';
import { Accordion, Button, Card, Col, Row } from 'react-bootstrap';
import ActivityCardsWeek from './ActivityCardsWeek'

class ActivityAccordion extends Component {

  constructor(props) {
    super(props);
    this.startWeek = new Date(props.weekOf);
    this.endWeek = new Date(props.weekOf);
    this.endWeek.setDate(this.startWeek.getDate() + 6);
  }

  formatDate = (date) => {
    //using 'default' was causing Edge to puke
    return `${date.getDate()} ${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear()}`;
  }

  render() {
    return (
      <Accordion defaultActiveKey="0" className="mb-3">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" style={{ cursor: 'pointer' }}>
            Period of Accomplishments: {`${this.formatDate(this.startWeek)} - ${this.formatDate(this.endWeek)}`}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row>
                <ActivityCardsWeek
                  weekStart={this.startWeek}
                  actions={this.props.actions}
                  onClick={this.props.cardOnClick}
                />
              </Row>
              <Row>
                <Col xs={12}>
                  <Button disabled={this.props.disableNewButton} className="float-right" variant="primary" onClick={this.props.newButtonOnClick}>New</Button>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default ActivityAccordion;