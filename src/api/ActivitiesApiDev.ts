import { IActivity, IActivityApi, UserInfo } from "./ActivitiesApi";
import DateUtilities from "../utilities/DateUtilities";


export default class ActivitiesApiDev implements IActivityApi {

	activities: IActivity[] = [
		{
			Id: 1, 
			Title: 'SP BAC', 
			WeekOf: DateUtilities.getStartOfWeek(new Date()).toISOString(), 
			Branch: 'OZI',
			ActionTaken: 'Lorem\n ipsum\n dolor sit amet, consectetur adipiscing elit.\n Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', 
			IsBigRock: false, 
			IsHistoryEntry: true,
			OPRs: { results: [{ Id: '1', Title: 'Robert Porterfield' }, { Id: '2', Title: 'Jeremy Clark' }] },
			__metadata: {etag: "etag"}
		},
		{
			Id: 2, 
			Title: 'SP Support',
			WeekOf: DateUtilities.getStartOfWeek(new Date()).toISOString(), 
			Branch: 'OZI',
			ActionTaken: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', 
			IsBigRock: false, 
			IsHistoryEntry: false,
			OPRs: { results: [{ Id: '1', Title: 'Robert Porterfield' }] },
			__metadata: { etag: "etag" }
		},
		{
			Id: 3, 
			Title: 'SP Support', 
			WeekOf: DateUtilities.getStartOfWeek(new Date()).toISOString(), 
			Branch: 'OZIC',
			ActionTaken: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi euismod lacus ac sagittis mollis. Nulla ut quam sed nisl pulvinar cursus sit amet eget lacus. Suspendisse rutrum pulvinar tortor ut vehicula. Nunc non arcu imperdiet, semper urna at, facilisis lectus. Phasellus risus magna, dignissim vel consequat ac, tincidunt in lacus. Aliquam euismod fringilla mauris, ac bibendum quam pulvinar vitae. Donec iaculis accumsan mi sed tincidunt. Proin accumsan, massa vitae malesuada porta, mauris purus facilisis sem, vel laoreet magna urna eget nulla. Phasellus convallis ipsum a convallis tincidunt.\n\nNam in leo velit. Mauris at ullamcorper leo. In tortor ligula, efficitur et diam sit amet, tincidunt finibus ligula. Aliquam finibus egestas justo ut posuere. Vestibulum pharetra, tellus et finibus pellentesque, dui leo consectetur augue, sit amet pharetra nisl velit sed sapien. Quisque non nunc turpis. Donec eu erat mauris. In et tincidunt enim. Donec luctus eu lectus sed scelerisque. Nulla iaculis ultricies lectus, nec eleifend ipsum auctor a. Quisque sed massa eros.', 
			IsBigRock: true, 
			IsHistoryEntry: true,
			OPRs: { results: [{ Id: '2', Title: 'Jeremy Clark' }] },
			__metadata: { etag: "etag" }
		}
	];

	sleep() {
		return new Promise(r => setTimeout(r, 1500));
	}

	async fetchActivitiesByNumWeeks(numWeeks: number, weekStart: Date, userId: number): Promise<any> {
		await this.sleep();
		return this.activities;
	}

	async fetchActivitiesByDates(startDate: Date, endDate: Date, userId: number): Promise<any> {
		await this.sleep();
		return this.activities;
	}

	async fetchActivitiesByQueryString(query: string): Promise<any> {
		await this.sleep();
		return this.activities.filter(activity => activity.ActionTaken.includes(query));
	}

	async fetchBigRocksByDates(startDate: Date, endDate: Date, userId: number) {
		await this.sleep();
		return this.activities.filter(activity => activity.IsBigRock);
	}

	async fetchHistoryEntriesByDates(startDate: Date, endDate: Date, userId: number) {
		await this.sleep();
		return this.activities.filter(activity => activity.IsHistoryEntry);
	}

	async deleteActivity(activity: IActivity): Promise<any> {
		await this.sleep();
		this.activities = this.activities.filter(a => a.Id !== activity.Id);
		return { data: { ...activity, IsDeleted: true } };
	}

	async submitActivity(activity: IActivity): Promise<{ data: IActivity }> {
		if (activity.Id < 0) {
			activity.Id = Math.max.apply(Math, this.activities.map(o => o.Id)) + 1;
		} else {
			this.activities = this.activities.filter(a => a.Id !== activity.Id);
		}
		if (activity.OPRsId) {
			let results: UserInfo[] = activity.OPRsId.results.map((OPRId, index) => {
				return { Id: index.toString(), Title: "Some Title" }
			});
			activity.OPRs = { results: results };
		}

		this.activities.push(activity);
		await this.sleep();
		return { data: { ...activity } };
	}

}