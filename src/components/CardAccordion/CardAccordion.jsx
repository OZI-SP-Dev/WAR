import { Component } from "react";
import { Accordion, Card } from "react-bootstrap";

class CardAccordion extends Component {
  render() {
    return (
      <Accordion activeKey={this.props.activeEventKey} className="mb-3">
        <Card>
          <Accordion.Toggle
            className="report-toggle"
            as={Card.Header}
            eventKey={"0"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (typeof this.props.setActiveEventKey === "function") {
                if (this.props.activeEventKey === "0") {
                  this.props.setActiveEventKey("");
                } else {
                  this.props.setActiveEventKey("0");
                }
              }
            }}
          >
            {this.props.cardHeader}
            <div
              className={
                this.props.activeEventKey === "0"
                  ? "arrow-down float-right"
                  : "arrow-right float-right"
              }
            />
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>{this.props.children}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default CardAccordion;
