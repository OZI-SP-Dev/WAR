import { SPPersona } from "../components/PeoplePicker/PeoplePicker";

export interface ICachedPeople {
    getCachedPeople: () => SPPersona[],
    cachePerson: (person: SPPersona) => void,
    removePersonFromCache: (title: string) => SPPersona[]
}

const SBO_CACHED_PEOPLE: string = "warCachedPeople";

export const useCachedPeople = (): ICachedPeople => {

    const getCachedPeople = () => {
        const cachedPeople = localStorage.getItem(SBO_CACHED_PEOPLE);
        return cachedPeople ? JSON.parse(cachedPeople) : [];
    };

    const cachePerson = (person: SPPersona) => {
        // no point in caching them if there's no email because that's how they are looked up and differentiated
        // this also prevents a strange occurence where a duplicate person is saved but the duplicate doesn't have an email
        if (person.Email) {
            const people: SPPersona[] = getCachedPeople();
            // always put the new person at the front and filter them out of the old list to prevent duplicates
            localStorage.setItem(SBO_CACHED_PEOPLE, JSON.stringify([person, ...people.filter(p => p.Email !== person.Email)]));
        }
    }

    const removePersonFromCache = (title: string): SPPersona[] => {
        const people: SPPersona[] = getCachedPeople().filter((p: SPPersona) => p.text !== title);
        localStorage.setItem(SBO_CACHED_PEOPLE, JSON.stringify([...people]));
        return people;
    }

    return { getCachedPeople, cachePerson, removePersonFromCache };
}