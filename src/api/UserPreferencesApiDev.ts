import { IUserPreferencesApi, IUserPreferences } from "./UserPreferencesApi";


export default class UserPreferencesApiDev implements IUserPreferencesApi {

    prefs: IUserPreferences[] = [
        {
            Id: '1',
            Title: '1',
            User: {
                Title: "Robert Porterfield",
                Id: '1'
            },
            DefaultOrg: 'OZIC'
        },
        {
            Id: '2',
            Title: '2',
            User: {
                Title: "Jeremy Clark",
                Id: '2'
            },
            DefaultOrg: 'OZIC'
        }
    ]

    lastId: number = 2

    sleep(m: number) {
        return new Promise(r => setTimeout(r, m));
    }

    async fetchPreferences(userId: string): Promise<any> {
        await this.sleep(1500);
        return this.prefs;
    }

    async submitPreferences(userId: string, defaultOrg: string): Promise<any> {
        await this.sleep(1500);
        let existingIndex = this.prefs.findIndex(pref => pref.Title === userId);
        if (existingIndex > -1) {
            this.prefs[existingIndex] = { ...this.prefs[existingIndex], DefaultOrg: defaultOrg };
        } else {
            let newId: string = (++this.lastId).toString();
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