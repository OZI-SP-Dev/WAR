import { spWebContext } from '../providers/SPWebContext';
import UserPreferencesApiDev from './UserPreferencesApiDev';

export interface IUserPreferencesApi {

    /**
     * Returns the IUserPreferences for the given user
     * 
     * @param userId The ID of the user whose IUserPreferences will be returned
     */
    fetchPreferences(userId: number): Promise<IUserPreferences | null | undefined>,

    /**
     * Submits IUserPreferences for the given user. If the user already has IUserPreferences then it will update the existing preferences.
     * If the user has never submitted preferences before then this will submit a new IUserPreferences.
     * 
     * @param userId 
     * @param defaultOrg 
     */
    submitPreferences(userId: number, defaultOrg: string): Promise<any>
}

export interface IUserPreferences {
    Id: number,
    Title: string,
    User: {
        Title: string,
        Id: number
    },
    DefaultOrg: string,
    updateDefaultOrg?: (defaultOrg: string) => void
}

export default class UserPreferencesApi implements IUserPreferencesApi {
    userPreferencesList = spWebContext.lists.getByTitle("UserPreferences");

    async fetchPreferences(userId: number): Promise<IUserPreferences | null> {
        let userPreferences: IUserPreferences[] = await this.userPreferencesList.items.select("Id", "Title", "User/Title", "User/Id", "DefaultOrg").expand("User").filter(`UserId eq ${userId}`).get();
        return userPreferences.length > 0 ? userPreferences[0] : null;
    }

    async submitPreferences(userId: number, defaultOrg: string): Promise<any> {
        let userPreferences: IUserPreferences | null = await this.fetchPreferences(userId);
        if (userPreferences) {
            return this.userPreferencesList.items.getById(userPreferences.Id).update({ DefaultOrg: defaultOrg });
        } else {
            return this.userPreferencesList.items.add({
                Title: `${userId}`,
                UserId: userId,
                DefaultOrg: defaultOrg
            });
        }
    }
}

export class UserPreferencesApiConfig {
    static userPreferencesApi: IUserPreferencesApi = process.env.NODE_ENV === 'development' ? new UserPreferencesApiDev() : new UserPreferencesApi();
}