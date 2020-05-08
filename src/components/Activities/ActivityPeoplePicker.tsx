import * as React from 'react';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';
import { people } from '@uifabric/example-data';
import { sp } from "@pnp/sp";
import "@pnp/sp/profiles";
import { IPeoplePickerEntity } from '@pnp/sp/profiles';

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
	SPUserId?: string
}

type ActivityPeoplePicker = {
	defaultValue?: SPPersona[],
	value?: SPPersona[],
	readonly?: boolean,
	required?: boolean,
	updateOPRs: (p: SPPersona[]) => VoidFunction
}

export const ActivityPeoplePicker: React.FunctionComponent<ActivityPeoplePicker> = ({ defaultValue, updateOPRs, required }) => {
	const [peopleList] = React.useState<IPersonaProps[]>(people);
	const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);

	React.useEffect(() => {
		let personas: SPPersona[] = [];
		if (defaultValue) {
			personas = [...defaultValue];
		}
		setSelectedItems(personas);
		// eslint-disable-next-line
	}, [])

	const onFilterChanged = async (
		filterText: string,
		currentPersonas: IPersonaProps[] | undefined,
	): Promise<IPersonaProps[]> => {
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
					const persona: SPPersona = {
						text: person.DisplayText,
						secondaryText: person.EntityData.Title,
						imageInitials: person.DisplayText.substr(person.DisplayText.indexOf(' ') + 1, 1) + person.DisplayText.substr(0, 1),
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
			updateOPRs(items);
		}
	};

	const isInvalid = (): boolean => {
		return selectedItems.length ? false : true;
	}

	const validateInput = (input: string): ValidationState => {
		console.log('validateInput called');
		return ValidationState.invalid;
	}

	return (
		<NormalPeoplePicker
			onResolveSuggestions={onFilterChanged}
			getTextFromItem={getTextFromItem}
			pickerSuggestionsProps={suggestionProps}
			className={isInvalid() ? 'ms-PeoplePicker is-invalid' : 'ms-PeoplePicker'}
			key={'controlled'}
			selectedItems={selectedItems}
			onChange={onItemsChange}
			resolveDelay={300}
			onValidateInput={validateInput}
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