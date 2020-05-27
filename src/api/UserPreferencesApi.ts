import { spWebContext } from '../providers/SPWebContext';
import UserPreferencesApiDev from './UserPreferencesApiDev';

export interface IUserPreferencesApi {
    fetchPreferences(userId: string): Promise<any>,
    submitPreferences(userId: string, defaultOrg: string): Promise<any>
}

export interface IUserPreferences {
    Id: string,
    Title: string,
    User: {
        Title: string,
        Id: string
    },
    DefaultOrg: string
}

export default class UserPreferencesApi implements IUserPreferencesApi {
    userPreferencesList = spWebContext.lists.getByTitle("UserPreferences");

    fetchPreferences(userId: string): Promise<IUserPreferences> {
        return this.userPreferencesList.items.select("Title", "User/Title", "User/Id", "DefaultOrg").filter(`UserId eq ${userId}`).get();
    }

    async submitPreferences(userId: string, defaultOrg: string): Promise<any> {
        let userPreferences: IUserPreferences = await this.fetchPreferences(userId);
        if (userPreferences) {
            return this.userPreferencesList.items.getById(userPreferences.Id).update({ DefaultOrg: defaultOrg});
        } else {
            return this.userPreferencesList.items.add({
                Title: userId,
                UserId: userId,
                DefaultOrg: defaultOrg
            });
        }
    }
}

export class UserPreferencesApiConfig {
    static userPreferencesApi: IUserPreferencesApi = process.env.NODE_ENV === 'development' ? new UserPreferencesApiDev() : new UserPreferencesApi();
}