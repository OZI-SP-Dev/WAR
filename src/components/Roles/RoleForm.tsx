import { Spinner, SpinnerSize } from "@fluentui/react";
import "@pnp/sp/profiles";
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import * as React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IRole, RolesApiConfig } from "../../api/RolesApi";
import RoleUtilities from '../../utilities/RoleUtilities';
import { PeoplePicker, SPPersona } from "../PeoplePicker/PeoplePicker";
import { RolesContext } from "./RolesContext";

export interface IRoleForm {
	roleType: string,
	orgs: string[]
}

export const RoleForm: React.FunctionComponent<IRoleForm> = ({ roleType, orgs }) => {
	const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);
	const [selectedDepartment, setSelectedDepartment] = React.useState<string>("");
	const [didUserSubmit, setDidUserSubmit] = React.useState<boolean>(false);
	const [defaultValue, setDefaultValue] = React.useState<SPPersona[]>();
	const [isSaving, setIsSaving] = React.useState<boolean>(false);

	const rolesContext = React.useContext(RolesContext);
	const { rolesList, setRolesList } = rolesContext;
	const rolesApi = RolesApiConfig.rolesApi;

	const personasPicked = () => {
		setDidUserSubmit(true);
		if (rolesList && setRolesList !== undefined && departmentFieldValid()) {
			setIsSaving(true);
			let newRolesList = [...rolesList];
			Promise.all(selectedItems.map(async (newpersona) => {
				if (newpersona.text) {
					try {
						let newRole: IRole = { ...newpersona };
						newRole.RoleName = roleType;
						newRole.Department = selectedDepartment;
						newRole.secondaryText = `${roleType !== RoleUtilities.ADMIN && newRole.Department !== null ? " for Department " + newRole.Department : ""}`;
						let updatedRole = await rolesApi.addRole(newRole);
						// SharePoint returns a data object with Id, the DevApi just returns ItemID
						newRole.ItemID = updatedRole?.data?.Id || updatedRole.ItemID;
						newRolesList.push(newRole);
					}
					catch (e) {
						window.alert(e);
					}
				}
			})).then(() => {
				setDidUserSubmit(false);
				setRolesList(newRolesList);
			}).finally(() => {
				//Mark the entry as no longer saving regardless of if we failed to save or suceeded
				setIsSaving(false);
				setSelectedItems([]);
				setDefaultValue([]);				
			}
			);
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
					{/*Create a fieldset so we can disable the entire form while it is saving/adding*
					  Because the PeoplePicker is using a readOnly attribute, we have to set that manually below */}
					<fieldset disabled={isSaving}>
						<Form.Group>
							<Form.Label>New {roleType}</Form.Label>
							<PeoplePicker
								key={'controlled'}
								itemLimit={1}
								updatePeople={onItemsChange}
								readOnly={isSaving}
								defaultValue={defaultValue}
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
						<Button className="float-right" onClick={personasPicked}>
							{isSaving && <Spinner className="float-left" size={SpinnerSize.small} role="status" aria-hidden="true" />}
							Add {roleType}</Button>
					</fieldset>
				</Form>
			</Col>
		</Row >
	);
};