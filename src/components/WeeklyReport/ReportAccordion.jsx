import React, { Component } from 'react';
import { Accordion, Card } from 'react-bootstrap';

class ReportAccordion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accordionOpen: true
        }
    }

    render() {
        return (
            <Accordion defaultActiveKey={"0"} className="mb-3">
                <Card>
                    <Accordion.Toggle
                        className="report-toggle"
                        as={Card.Header}
                        eventKey={"0"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.setState({ accordionOpen: !this.state.accordionOpen })}>
                        {this.props.searchCardHeader}
                            <div className={this.state.accordionOpen ? 'arrow-down float-right' : 'arrow-right float-right'} />
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>{this.props.children}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        );
    }
}

export default ReportAccordion;