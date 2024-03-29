import { Moment } from "moment";
import { FunctionComponent, useRef, useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IActivity, UserList } from "../../api/ActivitiesApi";
import { OrgsContext } from "../../providers/OrgsContext";
import DateUtilities from "../../utilities/DateUtilities";
import { PeoplePicker, SPPersona } from "../PeoplePicker/PeoplePicker";
import ActivityModal from "./ActivityModal";
import { DatePickerCustomInput } from "../DatePickerCustomInput/DatePickerCustomInput";
import { IconButton } from "office-ui-fabric-react";

export interface IEditActivityModalProps {
  activity: IActivity;
  showEditModal: boolean;
  deleting: boolean;
  saving: boolean;
  error: boolean;
  minCreateDate: Moment;
  submitEditActivity: (activity: IActivity) => void;
  handleDelete: (activity: IActivity) => void;
  closeEditActivity: () => void;
  canEdit: (activity: IActivity) => boolean;
  showMarCheck: (org: string) => boolean;
  showHistoryCheck: (org: string) => boolean;
  userIsOrgChief: (org: string) => boolean;
}

export const EditActivityModal: FunctionComponent<IEditActivityModalProps> = (
  props
) => {
  const weekStart = DateUtilities.getStartOfWeek(props.activity?.WeekOf);
  const [activity, setActivity] = useState<IActivity>({ ...props.activity });
  const [validated, setValidated] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    DateUtilities.momentToDate(weekStart)
  );
  const [highlightDates, setHighlightDates] = useState<Date[]>(
    DateUtilities.getWeek(weekStart)
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const convertOPRsToPersonas = (OPRs?: UserList) => {
    let personas: SPPersona[] = [];
    if (OPRs && OPRs.results) {
      personas = OPRs.results.map((OPR) => {
        return {
          text: OPR.Title,
          imageInitials:
            OPR.Title.substr(OPR.Title.indexOf(" ") + 1, 1) +
            OPR.Title.substr(0, 1),
          SPUserId: OPR.Id,
          Email: OPR.Email,
        };
      });
    }
    return personas;
  };

  const handleOpen = () => {
    let weekStart = DateUtilities.getStartOfWeek(props.activity.WeekOf);
    // Deep copy activity
    let editActivity = { ...props.activity };
    editActivity.OPRs = {
      results: props.activity.OPRs ? [...props.activity.OPRs.results] : [],
    };
    setActivity(editActivity);
    setValidated(false);
    setSelectedDate(DateUtilities.momentToDate(weekStart));
    setHighlightDates(DateUtilities.getWeek(weekStart));
  };

  // Syncs fields between react state and form
  const updateActivity = (newValue: any, fieldUpdating: string): void => {
    setActivity({ ...activity, [fieldUpdating]: newValue });
  };

  const updateOPRs = (value: SPPersona[]) => {
    const newActivity: IActivity = { ...activity };
    newActivity.OPRs = {
      results: value.map((newOPR) => {
        return {
          Id: newOPR.SPUserId ? newOPR.SPUserId : 0, // Set to 0 if not defined -- we can then look up the user when processing
          Title: newOPR.text ? newOPR.text : "",
          Email: newOPR.Email,
        };
      }),
    };
    setActivity(newActivity);
  };

  const isOPRInvalid = () => {
    return activity.OPRs &&
      activity.OPRs.results &&
      activity.OPRs.results.length
      ? false
      : true;
  };

  const validateActivity = () => {
    const form = document.getElementById("EditActivityModal");
    if (
      form instanceof HTMLFormElement &&
      form.checkValidity() === true &&
      !isOPRInvalid()
    ) {
      props.submitEditActivity(activity);
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  const onDateChange = (date: Date | Moment | string | null) => {
    let selectedDate = DateUtilities.getStartOfWeek(date);
    let highlightDates = DateUtilities.getWeek(selectedDate);
    setSelectedDate(DateUtilities.momentToDate(selectedDate));
    updateActivity(selectedDate.toISOString(), "WeekOf");
    setHighlightDates(highlightDates);
  };

  const isReadOnly = () => {
    return (
      !props.canEdit(props.activity) ||
      (DateUtilities.getDate(props.activity.WeekOf) < props.minCreateDate &&
        !props.userIsOrgChief(props.activity.Branch))
    );
  };

  let datePickerRef = useRef(null);

  return (
    <ActivityModal
      modalDisplayName="Activity"
      show={props.showEditModal}
      handleShow={() => handleOpen()}
      handleClose={props.closeEditActivity}
      handleSubmit={validateActivity}
      handleDelete={() => props.handleDelete(activity)}
      deleting={props.deleting}
      saving={props.saving}
      readOnly={isReadOnly()}
      showDeleteButton={props.activity.Id > -1}
      error={props.error}
      wide={activity.IsMarEntry}
    >
      <Form
        id="EditActivityModal"
        noValidate
        validated={validated}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          validateActivity();
        }}
      >
        <Container>
          <Row>
            <Col xs={activity.IsMarEntry ? "6" : "12"}>
              <Form.Group controlId="editActivityWeekOf">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => onDateChange(date)}
                  highlightDates={highlightDates}
                  minDate={DateUtilities.momentToDate(props.minCreateDate)}
                  maxDate={DateUtilities.momentToDate(DateUtilities.getToday())}
                  customInput={
                    <DatePickerCustomInput
                      ref={datePickerRef}
                      label="Period of Accomplishment (Week of)"
                      openPicker={() =>
                        !isReadOnly() && setDatePickerOpen(true)
                      }
                      required
                      readOnly={isReadOnly()}
                    />
                  }
                  open={datePickerOpen}
                  onClickOutside={() => setDatePickerOpen(false)}
                  shouldCloseOnSelect={false}
                />
              </Form.Group>
              <Form.Group controlId="editActivityOrg">
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={props.activity.Branch}
                  onChange={(e) => updateActivity(e.target.value, "Branch")}
                  disabled={isReadOnly()}
                  required
                >
                  <option value="">--</option>
                  <OrgsContext.Consumer>
                    {(orgsContext) => (
                      <>
                        {(orgsContext.orgs ? orgsContext.orgs : []).map(
                          (org) => (
                            <option key={org}>{org}</option>
                          )
                        )}
                      </>
                    )}
                  </OrgsContext.Consumer>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="editActivityTitle">
                <Form.Label>Activity/Purpose</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title with no trailing period"
                  defaultValue={props.activity.Title}
                  onChange={(e) => updateActivity(e.target.value, "Title")}
                  readOnly={isReadOnly()}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Enter a title with no trailing period.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="editActivityInterestItems">
                <Form.Label>Action Taken/In Work</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Actions taken..."
                  defaultValue={props.activity.ActionTaken}
                  onChange={(e) =>
                    updateActivity(e.target.value, "ActionTaken")
                  }
                  readOnly={isReadOnly()}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Enter at least one action taken.
                </Form.Control.Feedback>
              </Form.Group>
              {props.showMarCheck(activity.Branch) && (
                <Form.Group>
                  <InputGroup>
                    <Form.Check
                      label="MAR Entry?"
                      type="checkbox"
                      defaultChecked={props.activity.IsMarEntry}
                      onChange={(e) =>
                        updateActivity(e.target.checked, "IsMarEntry")
                      }
                      disabled={isReadOnly()}
                    />
                    {activity.IsMarEntry && (
                      <IconButton
                        onClick={(e) => {
                          const MARText = activity.ActionTaken;
                          updateActivity(MARText, "MARText");
                        }}
                        iconProps={{ iconName: "Copy" }}
                        title="Copy WAR text to MAR"
                        ariaLabel="Copy"
                        className="float-right"
                      />
                    )}
                  </InputGroup>
                </Form.Group>
              )}
              {props.showHistoryCheck(activity.Branch) && (
                <Form.Group>
                  <Form.Check
                    label="History Entry?"
                    type="checkbox"
                    defaultChecked={props.activity.IsHistoryEntry}
                    onChange={(e) =>
                      updateActivity(e.target.checked, "IsHistoryEntry")
                    }
                    disabled={isReadOnly()}
                  />
                </Form.Group>
              )}
              <Form.Group controlId="editActivityOPRs">
                <Form.Label>OPRs</Form.Label>
                <Form.Control
                  as={PeoplePicker}
                  defaultValue={convertOPRsToPersonas(activity.OPRs)}
                  updatePeople={(newOPRs: SPPersona[]) => updateOPRs(newOPRs)}
                  readOnly={isReadOnly()}
                  required={true}
                  itemLimit={25}
                  isInvalid={isOPRInvalid()}
                  isValid={!isOPRInvalid()}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  You must have at least one OPR.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {activity.IsMarEntry && (
              <Col xs={activity.IsMarEntry ? "6" : "12"}>
                <Form.Group controlId="editActivityMarText">
                  <Form.Label>MAR Text</Form.Label>
                  <Form.Text>
                    <ul>
                      <li>
                        Write at the strategic level for the 3-star; save
                        day-to-day commentary for Division briefs and
                        DPMAP/AcqDemo Input
                      </li>
                      <li>
                        Define ALL acronyms on first use, even those that seem
                        obvious or straightforward.
                      </li>
                    </ul>
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={19}
                    value={activity.MARText}
                    onChange={(e) => updateActivity(e.target.value, "MARText")}
                    readOnly={!props.userIsOrgChief(props.activity.Branch)}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Enter at least one action taken.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Container>
      </Form>
    </ActivityModal>
  );
};

export default EditActivityModal;
