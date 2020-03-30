import React, { Component } from 'react';
import { Button, Modal, Spinner, Alert, Form } from 'react-bootstrap';
import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";

class ContactUsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailProps: this.defaultEmailProps(),
      validated: false,
      sending: false,
      error: false
    }
  }

  defaultEmailProps() {
    const emailProps = {
      //To: MUST be to a valid SharePoint User
      To: this.props.contactEmails,
      Subject: "Weekly Activity Report",
      Body: "Here is the body. <b>It supports html</b>",
      AdditionalHeaders: {
          "content-type": "text/html"
      }
    };
    return emailProps;
  }

  /** Reset all form fields to defaults */
  resetForm() {
    const emailProps = this.defaultEmailProps();
    this.setState({ emailProps, validated: false });
  }

  sendEmail() {
    //call sharepoint function
    this.setState({ sending: true });
    sp.setup({
      sp: {
        baseUrl: process.env.REACT_APP_API_URL
      }
    });
    let emailProps = this.state.emailProps;
    emailProps.Body = encodeURIComponent(emailProps.body).replace("\r\n", "<br />");
    sp.utility.sendEmail(emailProps).then(
      () => {
        this.resetForm();
        this.setState({ sending: false });
        this.onHide();
      },
      (e) => {
        console.log("Error sending email");
        console.log(e);
        this.setState({ sending: false, error: true});
      }
    );
  }

  validateActivity(e) {
    const form = document.getElementById("ContactUs");
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.sendEmail();
    }
  }

  onHide() {
    //don't close if currently sending
    if (!this.state.sending) {
      this.props.hideContactUs();
    }
  }

  updateBody(e) {
    let emailProps = this.state.emailProps;
    emailProps.Body = e.target.value;
    this.setState({emailProps});
  }

  render() {
    return (
      <Modal show={this.props.showContactUsModal} onHide={() => this.onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="ContactUs" noValidate validated={this.state.validated}
            onSubmit={e => this.validateActivity(e)}
          >
            <Form.Group>
              <Form.Label>What can we help with?</Form.Label>
              <Form.Control as="textarea" rows="8"
                placeholder="Describe in as much detail as possible"
                defaultValue={this.state.Body}
                value={this.state.Body}
                onChange={(e) => this.updateBody(e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Enter a message, or Cancel this request.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={this.state.sending} variant="secondary" onClick={() => this.onHide()}>
            Cancel
          </Button>
          <Button disabled={this.state.sending} variant="primary" onClick={(e) => this.validateActivity(e)}>
            {this.state.sending && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
            {' '}Submit
          </Button>
          {this.state.error && <Alert variant='danger' className="w-100">There was an error sending your message!</Alert>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ContactUsModal;