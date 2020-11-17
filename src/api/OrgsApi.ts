import { spWebContext } from '../providers/SPWebContext';
import OrgsApiDev from './OrgsApiDev';

export interface IOrgsApi {
    /**
     * Returns all IOrgs that are in the system.
     */
    fetchOrgs(): Promise<IOrgs[] | null | undefined>
}

export interface IOrgs {
    Id: string,
    Title: string
}

export default class OrgsApi implements IOrgsApi {

    orgsList = spWebContext.lists.getByTitle("Orgs");

    fetchOrgs(): Promise<IOrgs[] | null | undefined> {
        return this.orgsList.items.select("Id", "Title").orderBy("Title", true).get();
    }
}

export class OrgsApiConfig {
    static orgsApi: IOrgsApi = process.env.NODE_ENV === 'development' ? new OrgsApiDev() : new OrgsApi();
}