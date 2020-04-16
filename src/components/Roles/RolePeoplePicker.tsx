import * as React from 'react';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';
import { people, mru } from '@uifabric/example-data';
import { Button, ButtonGroup } from 'react-bootstrap';
import { RolesApiConfig } from "./RolesApi";
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
	//addPersonas: (newPersonas: IPersonaProps[]) => void
	roleType: string
}

export const RolePeoplePicker: React.FunctionComponent<IRolePeoplePicker> = ({ roleType }) => {
	const [mostRecentlyUsed, setMostRecentlyUsed] = React.useState<IPersonaProps[]>(mru);
	const [peopleList, setPeopleList] = React.useState<IPersonaProps[]>(people);
	const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);

	const rolesContext = React.useContext(RolesContext);
	const { rolesList, setRolesList } = rolesContext;
	const rolesApi = RolesApiConfig.rolesApi;

	const picker = React.useRef(null);

	const personasPicked = () => {
		console.log(rolesList);
		if (rolesList && setRolesList !== undefined) {
			let newRolesList = [...rolesList];
			Promise.all(selectedItems.map(async (newpersona) => {
				if (newpersona.text) {
					//TODO change this to be some sort of identifier
					//let newRole = await rolesApi.addRole(roleType, newpersona.personaIdentifier);
					let newRole = await rolesApi.addRole(roleType, newpersona);
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

	const onFilterChanged = (
		filterText: string,
		currentPersonas: IPersonaProps[] | undefined,
	): IPersonaProps[] | Promise<IPersonaProps[]> => {
		if (filterText) {
			let filteredPersonas: IPersonaProps[] = filterPersonasByText(filterText);
			return filterPromise(filteredPersonas);
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

	const onRemoveSuggestion = (item: IPersonaProps): void => {
		const indexPeopleList: number = peopleList.indexOf(item);
		const indexMostRecentlyUsed: number = mostRecentlyUsed.indexOf(item);

		if (indexPeopleList >= 0) {
			const newPeople: IPersonaProps[] = peopleList
				.slice(0, indexPeopleList)
				.concat(peopleList.slice(indexPeopleList + 1));
			setPeopleList(newPeople);
		}

		if (indexMostRecentlyUsed >= 0) {
			const newSuggestedPeople: IPersonaProps[] = mostRecentlyUsed
				.slice(0, indexMostRecentlyUsed)
				.concat(mostRecentlyUsed.slice(indexMostRecentlyUsed + 1));
			setMostRecentlyUsed(newSuggestedPeople);
		}
	};

	return (
		<ButtonGroup>
			<NormalPeoplePicker
				onResolveSuggestions={onFilterChanged}
				getTextFromItem={getTextFromItem}
				pickerSuggestionsProps={suggestionProps}
				className={'ms-PeoplePicker'}
				key={'normal'}
				onRemoveSuggestion={onRemoveSuggestion}
				onValidateInput={validateInput}
				removeButtonAriaLabel={'Remove'}
				inputProps={{
					'aria-label': 'People Picker',
				}}
				componentRef={picker}
				onInputChange={onInputChange}
				resolveDelay={300}
				selectedItems={selectedItems}
				onItemSelected={itemSelected}
				
			/>
			<Button className="float-right" onClick={personasPicked}>Add {roleType}</Button>
		</ButtonGroup>
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