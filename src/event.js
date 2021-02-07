export default class Event {
  constructor(eventTime, day, members, name) {
    this.eventTime = eventTime;
    this.day = day;
    this.members = members;
    this.name = name;
  }

  hasMember(member) {
    return this.members.includes(member);
  }
}
