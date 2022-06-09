import React, { useState } from 'react';
import { Alert, Button, Col, Modal, Spinner } from 'react-bootstrap';
import ConfirmSubmitPopover from './ConfirmSubmitPopover';

export interface IActivityModalProps {
  show: boolean,
  saving: boolean,
  modalDisplayName?: string,
  readOnly: boolean,
  showDeleteButton: boolean,
  deleting: boolean,
  submitButtonVariant?: "primary" | "danger",
  submitButtonText?: string,
  error: boolean,
  handleShow: () => void,
  handleClose: () => void,
  handleDelete: () => void,
  handleSubmit: () => void
}

export const ActivityModal: React.FunctionComponent<IActivityModalProps> = (props) => {

  const [showDeletePopover, setShowDeletePopover] = useState<boolean>(false);
  const [deletePopoverTarget, setDeletePopoverTarget] = useState<any>(null);

  const onHide = () => {
    //don't close if currently saving
    if (!props.saving) {
      props.handleClose();
    }
  }

  return (
    <Modal keyboard={false} backdrop="static" show={props.show} onShow={() => props.handleShow()} onHide={() => onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDisplayName || "Pop-up"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children || "description"}</Modal.Body>
      <Modal.Footer>
        <Col style={{ paddingLeft: 0 }}>
          {!props.readOnly && props.showDeleteButton &&
            <>
              <ConfirmSubmitPopover
                title="Confirm Delete"
                text="Are you sure you would like to delete this Activity?"
                show={showDeletePopover}
                target={deletePopoverTarget}
                handleSubmit={props.handleDelete}
                submitting={props.deleting || props.saving}
                handleClosePopoverClick={() => setShowDeletePopover(false)}
                buttonVariant="danger"
              />
              <Button
                className="float-left"
                onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeletePopover(!showDeletePopover);
                  setDeletePopoverTarget(e.target);
                }}
                disabled={props.saving || props.deleting}
                variant="danger"
              >
                Delete
              </Button>
            </>}
        </Col>
        <Col style={{ paddingRight: 0 }}>
          {!props.readOnly &&
            <Button
              style={{ marginLeft: "5%" }}
              className="float-right"
              disabled={props.saving || props.deleting}
              variant={props.submitButtonVariant || "primary"}
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                props.handleSubmit();
              }}
            >
              {props.saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
              {' '}{props.submitButtonText || "Submit"}
            </Button>}
          <Button
            className="float-right"
            disabled={props.saving}
            variant="secondary"
            onClick={props.handleClose}>
            Close
          </Button>
        </Col>
        {props.error && <Alert variant='danger' className="w-100">There was an error saving your activity!</Alert>}
      </Modal.Footer>
    </Modal>
  );
}

export default ActivityModal;