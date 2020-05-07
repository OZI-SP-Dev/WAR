

export default class DateUtilities {

  static getStartOfWeek(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay(), 6, 0, 0, 0);
  }

  static getWeek(date: Date) {
    let weekStart: Date = this.getStartOfWeek(date);
    let week = [];
    for (let i = 0; i < 7; ++i) {
      week.push(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i, 0, 0, 0, 0));
    }
    return week;
  }
}