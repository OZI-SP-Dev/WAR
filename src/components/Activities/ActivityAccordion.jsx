import React, { Component } from 'react';
import { Accordion, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import DateUtilities from '../../utilities/DateUtilities';
import ActivityCardsWeek from './ActivityCardsWeek';

class ActivityAccordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.startWeek = DateUtilities.getDate(props.weekOf);
    this.endWeek = DateUtilities.getDate(props.weekOf);
    this.endWeek.add(6, 'days');
    let currentWeek = DateUtilities.getStartOfWeek();
    this.isThisWeek = this.datesAreEqual(this.startWeek, currentWeek);
    if (this.isThisWeek) {
      this.state.open = true;
    }
  }

  datesAreEqual(date1, date2) {
    return date1.year() === date2.year() && date1.month() === date2.month() && date1.date() === date2.date();
  }

  getFilteredActions() {
    return this.props.actions.filter(action => this.datesAreEqual(DateUtilities.getDate(action.WeekOf), this.startWeek));
  }

  accordionClicked = () => {
    this.setState({ open: !this.state.open });
  }

  formatDate = (date) => {
    //using 'default' was causing Edge to puke
    return date.format("DD MMM YYYY");
  }

  render() {
    let filteredActions = this.getFilteredActions();
    return (
      <Accordion defaultActiveKey={this.isThisWeek ? "0" : ""} className="mb-3">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" style={{ cursor: 'pointer' }} onClick={this.accordionClicked}>
            Period of Accomplishments: {`${this.formatDate(this.startWeek)} - ${this.formatDate(this.endWeek)} `}
            <Badge variant="secondary">{filteredActions.length}</Badge>
            <div className={this.state.open ? 'arrow-down float-right' : 'arrow-right float-right'} />
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Row>
                <ActivityCardsWeek
                  weekStart={this.startWeek}
                  actions={filteredActions}
                  onClick={this.props.cardOnClick}
                />
              </Row>
              <Row>
                <Col xs={12}>
                  {this.props.showNewButton && <Button disabled={this.props.disableNewButton} className="float-right" variant="primary" onClick={this.props.newButtonOnClick}>New</Button>}
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