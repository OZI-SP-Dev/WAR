import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";
import React, { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import DateUtilities from '../../utilities/DateUtilities';

export const ContactUsModal = (props) => {
	const defaultEmailProps = {
		//To: MUST be to a valid SharePoint User
		To: props.contactEmails,
		Subject: "Weekly Activity Report",
		Body: "",
		AdditionalHeaders: {
			"content-type": "text/html"
		}
	}

	const [emailProps, setEmailProps] = useState(defaultEmailProps);
	const [validated, setValidated] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);

	const location = useLocation().pathname;

	/** Reset all form fields to defaults */
	const resetForm = () => {
		setEmailProps(defaultEmailProps);
		setValidated(false);
	}

	const sendEmail = () => {
		//call sharepoint function
		setSending(true);
		sp.setup({
			sp: {
				baseUrl: process.env.REACT_APP_API_URL
			}
		});
		let sendmailProps = { ...emailProps };
		//use regex in order to replace all
		sendmailProps.Body = sendmailProps.Body
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\n/g, '<BR>');

		sendmailProps.Body = addAdditionalDetails(sendmailProps.Body);

		sp.utility.sendEmail(sendmailProps).then(
			() => {
				resetForm();
				setSending(false);
				onHide();
			},
			(e) => {
				console.log("Error sending email");
				console.log(e);
				setSending(false);
				setError(true);
			}
		);
	}

	const addAdditionalDetails = (body) => {
		let today = DateUtilities.getToday(true).toLocaleString();
		body = body + "<br><hr><br>Message sent by " + props.user +
			"<br>On " + today +
			"<br>From route " + location;
		return body;
	}

	const validateForm = (e) => {
		const form = document.getElementById("ContactUs");
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
			setValidated(true);
		} else {
			sendEmail();
		}
	}

	const onHide = () => {
		//don't close if currently sending
		if (!sending) {
			props.hideContactUs();
		}
	}

	const updateBody = (e) => {
		let newEmailProps = { ...emailProps };
		newEmailProps.Body = e.target.value;
		setEmailProps(newEmailProps);
	}

	return (
		<Modal show={props.showContactUsModal} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Contact Us!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id="ContactUs" noValidate validated={validated}
					onSubmit={validateForm}
				>
					<Form.Group>
						<Form.Label>What can we help with?</Form.Label>
						<Form.Control as="textarea" rows="8"
							placeholder="Describe in as much detail as possible"
							//defaultValue={emailProps.Body}
							value={emailProps.Body}
							onChange={updateBody}
							required
						/>
						<Form.Control.Feedback type="invalid">
							Enter a message, or Cancel this request.
              </Form.Control.Feedback>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button disabled={sending} variant="secondary" onClick={onHide}>
					Cancel
          </Button>
				<Button disabled={sending} variant="primary" onClick={validateForm}>
					{sending && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
					{' '}Submit
          </Button>
				{error && <Alert variant='danger' className="w-100">There was an error sending your message!</Alert>}
			</Modal.Footer>
		</Modal>
	);
}

export default ContactUsModal;