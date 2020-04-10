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
    this.startWeek = new Date(props.weekOf);
    this.endWeek = new Date(props.weekOf);
    this.endWeek.setDate(this.startWeek.getDate() + 6);
    let currentWeek = DateUtilities.getStartOfWeek(new Date());
    this.isThisWeek = this.datesAreEqual(this.startWeek, currentWeek);
    if (this.isThisWeek) {
      this.state.open = true;
    }
  }

  datesAreEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  getFilteredActions() {
    return this.props.actions.filter(action => this.datesAreEqual(new Date(action.WeekOf), this.startWeek));
  }

  accordionClicked = () => {
    this.setState({ open: !this.state.open });
  }

  formatDate = (date) => {
    //using 'default' was causing Edge to puke
    return `${date.getDate()} ${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear()}`;
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