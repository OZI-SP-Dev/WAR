import { IActivity, IActivityApi } from "./ActivitiesApi";


export default class ActivitiesApiDev implements IActivityApi {

    activities: IActivity[] = [
        {
            ID: 1, Title: 'SP BAC', WeekOf: '2020-04-05T06:00:00Z', Branch: 'OZI',
            ActionTaken: 'Lorem\n ipsum\n dolor sit amet, consectetur adipiscing elit.\n Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', TextOPRs: 'Robert Porterfield; Jeremy Clark', IsBigRock: false
        },
        {
            ID: 2, Title: 'SP Support', WeekOf: '2020-03-29T06:00:00Z', Branch: 'OZI',
            ActionTaken: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', TextOPRs: 'Robert Porterfield', IsBigRock: false
        },
        {
            ID: 3, Title: 'SP Support', WeekOf: '2020-03-29T06:00:00Z', Branch: 'OZIC',
            ActionTaken: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', TextOPRs: 'Robert Porterfield', IsBigRock: true
        }
    ];

    sleep(m: number) {
        return new Promise(r => setTimeout(r, m));
    } 

    async fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any> {
        await this.sleep(3000);
        return this.activities;
    }

    async fetchActivitiesByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
        await this.sleep(3000);
        return this.activities;
    }

    async submitActivity(activity: IActivity): Promise<{data: IActivity}> {
        if (activity.ID < 0) {
            activity.ID = Math.max.apply(Math, this.activities.map(o => o.ID)) + 1;
        }
        this.activities.push(activity);
        await this.sleep(3000);
        return {data: activity};
    }

}