import moment, { Moment } from "moment";


export default class DateUtilities {

  static getToday(keepTime?: boolean): Moment {
    return keepTime ? moment().utc() : moment().utc().startOf('day');
  }

  static getDate(date?: string | Moment | Date): Moment {
    return moment(date).utc().startOf('day');
  }

  static momentToDate(date: Moment): Date {
    return new Date(date.year(), date.month(), date.date());
  }

  static getStartOfWeek(date?: string | Moment | Date): Moment {
    return moment(date).utc().day(0).startOf('day');
  }

  static getEndOfWeek(date?: string | Moment | Date): Moment {
    return moment(date).utc().day(6).startOf('day');
  }

  static getWeek(date: string | Moment | Date | undefined): Date[] {
    let weekStart: Moment = this.getStartOfWeek(date);
    let week = [];
    for (let i = 0; i < 7; ++i) {
      week.push(this.momentToDate(moment(weekStart).day(i)));
    }
    return week;
  }
}