import { IUserPreferencesApi, IUserPreferences } from "./UserPreferencesApi";


export default class UserPreferencesApiDev implements IUserPreferencesApi {

    prefs: IUserPreferences[] = [
        {
            Id: '1',
            Title: '1',
            User: {
                Title: "Default User",
                Id: '1'
            },
            DefaultOrg: 'OZIC'
        }
    ]

    lastId: number = 2

    sleep(m: number) {
        return new Promise(r => setTimeout(r, m));
    }

    async fetchPreferences(userId: string): Promise<IUserPreferences | null | undefined> {
        await this.sleep(1500);
        return this.prefs.find(pref => pref.Title === userId);
    }

    async submitPreferences(userId: string, defaultOrg: string): Promise<any> {
        await this.sleep(1500);
        let existingIndex = this.prefs.findIndex(pref => pref.Title === userId);
        if (existingIndex > -1) {
            this.prefs[existingIndex] = { ...this.prefs[existingIndex], DefaultOrg: defaultOrg };
        } else {
            this.prefs.push({
                Id: userId,
                Title: userId,
                User: {
                    Title: "New User",
                    Id: userId
                },
                DefaultOrg: defaultOrg
            })
        }
    }

}