import moment, { Moment } from "moment";


export default class DateUtilities {

  /**
   * Get the current date as a Moment.
   * 
   * @param keepTime boolean flag to keep the current time if true and to get the beginning of the day if false or undefined
   */
  static getToday(keepTime?: boolean): Moment {
    return keepTime ? moment().utc() : moment().utc().startOf('day');
  }

  /**
   * Get the given date as a Moment date object set to the beginning of the day.
   * 
   * @param date The Date/String/Moment date that will be returned set to the beginning of the day as a Moment.
   * If undefined then it will return the current date. If the string is not formatted in a Moment recognized way then
   * this will likely throw an error.
   */
  static getDate(date?: string | Moment | Date): Moment {
    return moment(date).utc().startOf('day');
  }

  /**
   * Returns the given Moment as a Date object set to the beginning of the day.
   * 
   * @param date a Moment to be turned into a Date
   */
  static momentToDate(date: Moment): Date {
    return new Date(date.year(), date.month(), date.date());
  }

  /**
   * Returns the beginning of the week for a given date as a Moment.
   * 
   * @param date The date given as a string/Moment/Date to get the Sunday Date of.
   * If undefined then it will return the current week's beginning date. If the string is not formatted in a Moment recognized way then
   * this will likely throw an error.
   */
  static getStartOfWeek(date?: string | Moment | Date | null): Moment {
    return moment(date ? date : undefined).utc().day(0).startOf('day');
  }

  /**
   * Returns the end of the week for a given date as a Moment.
   *
   * @param date The date given as a string/Moment/Date to get the Saturday Date of.
   * If undefined then it will return the current week's end date. If the string is not formatted in a Moment recognized way then
   * this will likely throw an error.
   */
  static getEndOfWeek(date?: string | Moment | Date): Moment {
    return moment(date).utc().day(6).startOf('day');
  }

  /**
   * Returns an array of Date objects with each Date for the week of the given date.
   * 
   * @param date The date as a string/Moment/Date to get the week of.
   * If undefined then it will return the current week. If the string is not formatted in a Moment recognized way then
   * this will likely throw an error.
   */
  static getWeek(date: string | Moment | Date | undefined): Date[] {
    let weekStart: Moment = this.getStartOfWeek(date);
    let week = [];
    for (let i = 0; i < 7; ++i) {
      week.push(this.momentToDate(moment(weekStart).day(i)));
    }
    return week;
  }

  static datesAreEqual(date1: Moment, date2: Moment): boolean {
    return date1.isSame(date2, 'days');
  }
}