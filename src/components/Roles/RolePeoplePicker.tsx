import { sp } from "@pnp/sp";
import "@pnp/sp/profiles";
import { IPeoplePickerEntity } from '@pnp/sp/profiles';
import { people } from '@uifabric/example-data';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';
import * as React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IRole, RolesApiConfig } from "../../api/RolesApi";
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

export interface IRolePeoplePicker {
	roleType: string
}

export const RolePeoplePicker: React.FunctionComponent<IRolePeoplePicker> = ({ roleType }) => {
	const [peopleList] = React.useState<IPersonaProps[]>(people);
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
					let newRole: IRole = { ...newpersona };
					newRole.RoleName = roleType;
					newRole.Department = selectedDepartment;
					newRole.text = `${newpersona.text}${roleType !== "Admin" && newRole.Department !== null ? " for Department " + newRole.Department : ""}`;
					let updatedRole = await rolesApi.addRole(newRole);
					newRole.ItemID = updatedRole.Id || updatedRole.ItemID;
					newRolesList.push(newRole);
				}
			})).then(() => {
				setRolesList(newRolesList);
				setSelectedItems([]);
			});
		}
	}

	const itemSelected = (selectedItem?: IPersonaProps | undefined): IPersonaProps | null => {
		if (selectedItem) {
			let items = selectedItems.slice();
			items.push(selectedItem);
			setSelectedItems(items);
			return selectedItem;
		} else {
			return null;
		}
	}

	const onFilterChanged = async (
		filterText: string,
		currentPersonas: IPersonaProps[] | undefined,
	): Promise<IPersonaProps[]> => {
		console.log('New filter: ' + filterText);
		if (filterText) {
			let filteredPersonas: IPersonaProps[] | Promise<IPersonaProps[]>;
			if (process.env.NODE_ENV === 'development') {
				filteredPersonas = filterPromise(filterPersonasByText(filterText));
			} else {
				sp.setup({
					sp: {
						baseUrl: process.env.REACT_APP_API_URL
					}
				});
				const results = await sp.profiles.clientPeoplePickerSearchUser({
					AllowEmailAddresses: true,
					AllowMultipleEntities: false,
					MaximumEntitySuggestions: 25,
					QueryString: filterText
				});
				let newPersonas: IPersonaProps[] = [];
				results.forEach((person: IPeoplePickerEntity) => {
					console.log(person);
					const persona: IRole = {
						text: person.DisplayText,
						secondaryText: person.EntityData.Title,
						imageInitials: person.DisplayText.substr(person.DisplayText.indexOf(' ') + 1, 1) + person.DisplayText.substr(0, 1),
						RoleName: roleType,
						Email: person.EntityData.Email
					}
					newPersonas.push(persona);
				});
				filteredPersonas = newPersonas;
			}

			return filteredPersonas;
		} else {
			return [];
		}
	};

	const filterPersonasByText = (filterText: string): IPersonaProps[] => {
		return peopleList.filter(item => doesTextStartWith(item.text as string, filterText));
	};

	const filterPromise = (personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
		return convertResultsToPromise(personasToReturn);
	};

	const onItemsChange = (items: any[] | void): void => {
		if (items) {
			setSelectedItems(items);
		}
	};

	const departmentFieldValid = (): boolean => {
		return roleType === "Admin" || (selectedDepartment !== undefined && selectedDepartment !== "" && selectedDepartment !== "--");
	}

	return (
		<Row>
			<Col md='5'>
				<Form>
					<Form.Group>
						<Form.Label>New {roleType}</Form.Label>
						<NormalPeoplePicker
							onResolveSuggestions={onFilterChanged}
							getTextFromItem={getTextFromItem}
							pickerSuggestionsProps={suggestionProps}
							className={'ms-PeoplePicker'}
							key={'controlled'}
							onValidateInput={validateInput}
							removeButtonAriaLabel={'Remove'}
							inputProps={{
								'aria-label': 'People Picker',
							}}
							itemLimit={1}
							onInputChange={onInputChange}
							resolveDelay={300}
							selectedItems={selectedItems}
							onItemSelected={itemSelected}
							onChange={onItemsChange}
						/>
					</Form.Group>
					{roleType !== "Admin" &&
						<Form.Group>
							<Form.Label>New {roleType}'s Department</Form.Label>
							<Form.Control as="select"
								value={selectedDepartment}
								onChange={(e) => setSelectedDepartment(e.currentTarget.value)}
								isInvalid={didUserSubmit && !departmentFieldValid()}
							>
								<option>--</option>
								{roleType !== "Reviewer" && <option>OZI</option>}
								{roleType === "Reviewer" && <option>OZIC</option>}
								{roleType === "Reviewer" && <option>OZIF</option>}
								{roleType === "Reviewer" && <option>OZIP</option>}
							</Form.Control>
							<Form.Control.Feedback type='invalid'>Please provide a department for the {roleType}</Form.Control.Feedback>
						</Form.Group>}
					<Button className="float-right" onClick={personasPicked}>Add {roleType}</Button>
				</Form>
			</Col>
		</Row >
	);
};

function doesTextStartWith(text: string, filterText: string): boolean {
	return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

function convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
	return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
}

function getTextFromItem(persona: IPersonaProps): string {
	return persona.text as string;
}

function validateInput(input: string): ValidationState {
	if (input.indexOf('@') !== -1) {
		return ValidationState.valid;
	} else if (input.length > 1) {
		return ValidationState.warning;
	} else {
		return ValidationState.invalid;
	}
}

/**
 * Takes in the picker input and modifies it in whichever way
 * the caller wants, i.e. parsing entries copied from Outlook (sample
 * input: "Aaron Reid <aaron>").
 *
 * @param input The text entered into the picker.
 */
function onInputChange(input: string): string {
	const outlookRegEx = /<.*>/g;
	const emailAddress = outlookRegEx.exec(input);

	if (emailAddress && emailAddress[0]) {
		return emailAddress[0].substring(1, emailAddress[0].length - 1);
	}

	return input;
}