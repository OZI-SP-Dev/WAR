import { sp } from "@pnp/sp";
import "@pnp/sp/profiles";
import { IPeoplePickerEntity } from '@pnp/sp/profiles';
import { people } from '@uifabric/example-data';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import * as React from 'react';
import { useCachedPeople } from "../../hooks/useCachedPeople";

const suggestionProps: IBasePickerSuggestionsProps = {
	suggestionsHeaderText: 'Suggested People',
	mostRecentlyUsedHeaderText: 'Suggested Contacts',
	noResultsFoundText: 'No results found',
	loadingText: 'Loading',
	showRemoveButtons: true,
	suggestionsAvailableAlertText: 'People Picker Suggestions available',
	suggestionsContainerAriaLabel: 'Suggested contacts',
};

export interface SPPersona extends IPersonaProps {
	AccountName?: string,
	Department?: string,
	Email?: string,
	SPUserId?: number
}

interface IPeoplePickerProps {
	defaultValue?: SPPersona[],
	readOnly?: boolean,
	required?: boolean,
	itemLimit?: number,
	updatePeople: (p: SPPersona[]) => void
}

export const PeoplePicker: React.FunctionComponent<IPeoplePickerProps> = (props) => {

	const getEmptyResolveSuggestions = (selectedItems? : IPersonaProps[] | undefined): IPersonaProps[] =>  {
		let cachedResults = cachedPeople.getCachedPeople();

		//Remove already selected users from the initial suggestions
		if(selectedItems){
			cachedResults = removeDuplicates(cachedResults,selectedItems);
		}

		return cachedResults.slice(0, 10);
	}

	const removeSuggestion = (person: IPersonaProps) => {
		setSuggestions(cachedPeople.removePersonFromCache(person.text ? person.text : person.title ? person.title : '').slice(0, 10));
	}

	const cachedPeople = useCachedPeople();
	// I don't quite understand this but updating suggestions makes it update the rendered suggestions
	const [, setSuggestions] = React.useState<IPersonaProps[]>(getEmptyResolveSuggestions);
	const [peopleList] = React.useState<IPersonaProps[]>(people);
	const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);

	const peoplePickerInput = React.useRef<any>(null);

	React.useEffect(() => {
		let personas: SPPersona[] = [];
		if (props.defaultValue) {
			personas = [...props.defaultValue];
		}
		setSelectedItems(personas);
	}, [props.defaultValue]);

	const onFilterChanged = async (
		filterText: string,
		currentPersonas: IPersonaProps[] | undefined,
	): Promise<IPersonaProps[]> => {
		if (filterText) {
			let filteredPersonas: IPersonaProps[] | Promise<IPersonaProps[]>;
			if (process.env.NODE_ENV === 'development') {
				filteredPersonas = filterPersonasByText(filterText);
			} else {
				const results = await sp.profiles.clientPeoplePickerSearchUser({
					AllowEmailAddresses: false,
					AllowMultipleEntities: false,
					MaximumEntitySuggestions: 25,
					QueryString: filterText,
					PrincipalSource: 15,
					PrincipalType: 1
				});
				let newPersonas: IPersonaProps[] = [];
				results.forEach((person: IPeoplePickerEntity) => {
					const persona: SPPersona = {
						text: person.DisplayText,
						secondaryText: person.EntityData.Title,
						imageInitials: person.DisplayText.substr(person.DisplayText.indexOf(' ') + 1, 1) + person.DisplayText.substr(0, 1),
						Email: person.EntityData.Email
					};
					newPersonas.push(persona);
				});

				filteredPersonas = [
					...cachedPeople.getCachedPeople().filter(p => p.text?.toLowerCase().includes(filterText.toLowerCase())),
					...newPersonas
				];

			}

			// If people were already selected, then do not list them as possible additions
			if (currentPersonas && filteredPersonas) {
				filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas)
			}

			// Build in a delay if in the dev environment
			if (process.env.NODE_ENV === 'development') 
			{
				filteredPersonas = filterPromise(filteredPersonas);
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
			items.forEach(i => cachedPeople.cachePerson(i));
			props.updatePeople(items);
			peoplePickerInput.current?.focus();
		}
	};

	const isInvalid = (): boolean => {
		return selectedItems.length ? false : true;
	}

	const removeDuplicates = (personas: IPersonaProps[], possibleDupes: IPersonaProps[]): IPersonaProps[] => {
		return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
	}

	const listContainsPersona = (persona: IPersonaProps, personas: IPersonaProps[]): boolean => {
		if (!personas || !personas.length || personas.length === 0) {
			return false;
		}
		return personas.filter(item => item.text === persona.text).length > 0;
	}

	return (
		<NormalPeoplePicker
			disabled={props.readOnly}
			onResolveSuggestions={onFilterChanged}
			getTextFromItem={getTextFromItem}
			pickerSuggestionsProps={suggestionProps}
			className={isInvalid() ? 'ms-PeoplePicker is-invalid' : 'ms-PeoplePicker'}
			key={'controlled'}
			selectedItems={selectedItems}
			onChange={onItemsChange}
			resolveDelay={300}
			componentRef={peoplePickerInput}
			itemLimit={props.itemLimit ? props.itemLimit : 1}
			onEmptyResolveSuggestions={getEmptyResolveSuggestions}
			onRemoveSuggestion={removeSuggestion}
		/>
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