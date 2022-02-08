import "@pnp/sp/profiles";
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps } from 'office-ui-fabric-react/lib/Pickers';
import * as React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IRole, RolesApiConfig } from "../../api/RolesApi";
import RoleUtilities from '../../utilities/RoleUtilities';
import { PeoplePicker } from "../PeoplePicker/PeoplePicker";
import { RolesContext } from "./RolesContext";

const suggestionProps: IBasePickerSuggestionsProps = {
	suggestionsHeaderText: 'Suggested People',
	mostRecentlyUsedHeaderText: 'Suggested Contacts',
	noResultsFoundText: 'No results found',
	loadingText: 'Loading',
	showRemoveButtons: true,
	suggestionsAvailableAlertText: 'People Picker Suggestions available',
	suggestionsContainerAriaLabel: 'Suggested contacts',
};

export interface IRoleForm {
	roleType: string,
	orgs: string[]
}

export const RoleForm: React.FunctionComponent<IRoleForm> = ({ roleType, orgs }) => {
	const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);
	const [selectedDepartment, setSelectedDepartment] = React.useState<string>("");
	const [didUserSubmit, setDidUserSubmit] = React.useState<boolean>(false);

	const rolesContext = React.useContext(RolesContext);
	const { rolesList, setRolesList } = rolesContext;
	const rolesApi = RolesApiConfig.rolesApi;

	const personasPicked = () => {
		//TODO Need a spinner while we add/save new roles
		setDidUserSubmit(true);
		if (rolesList && setRolesList !== undefined && departmentFieldValid()) {
			let newRolesList = [...rolesList];
			Promise.all(selectedItems.map(async (newpersona) => {
				if (newpersona.text) {
					try{
						let newRole: IRole = { ...newpersona };
						newRole.RoleName = roleType;
						newRole.Department = selectedDepartment;
						newRole.secondaryText = `${roleType !== RoleUtilities.ADMIN && newRole.Department !== null ? " for Department " + newRole.Department : ""}`;
						let updatedRole = await rolesApi.addRole(newRole);
						// SharePoint returns a data object with Id, the DevApi just returns ItemID
						newRole.ItemID = updatedRole?.data?.Id || updatedRole.ItemID;
						newRolesList.push(newRole);
					}
					catch(e)
					{
						window.alert(e);
					}
				}
			})).then(() => {
				setRolesList(newRolesList);
				setSelectedItems([]);
			});
		}
	}

	const onItemsChange = (items: any[] | void): void => {
		if (items) {
			setSelectedItems(items);
		}
	};

	const departmentFieldValid = (): boolean => {
		return roleType === RoleUtilities.ADMIN || (selectedDepartment !== undefined && selectedDepartment !== "" && selectedDepartment !== "--");
	}

	return (
		<Row>
			<Col md='5'>
				<Form>
					<Form.Group>
						<Form.Label>New {roleType}</Form.Label>
						<PeoplePicker
							key={'controlled'}
							itemLimit={1}
							updatePeople={onItemsChange}
						/>
					</Form.Group>
					{roleType !== RoleUtilities.ADMIN &&
						<Form.Group>
							<Form.Label>New {roleType}'s Department</Form.Label>
							<Form.Control as="select"
								value={selectedDepartment}
								onChange={(e) => setSelectedDepartment(e.currentTarget.value)}
								isInvalid={didUserSubmit && !departmentFieldValid()}
							>
								<option>--</option>
								{orgs.map(org => <option key={org}>{org}</option>)}
							</Form.Control>
							<Form.Control.Feedback type='invalid'>Please provide a department for the {roleType}</Form.Control.Feedback>
						</Form.Group>}
					<Button className="float-right" onClick={personasPicked}>Add {roleType}</Button>

				</Form>
			</Col>
		</Row >
	);
};