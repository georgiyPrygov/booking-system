/**
 * We do this to get a copy of moment w/timezones without polluting the global scope
 */
 let moment = require('moment');
 // moment-timezone makes changes to existing moment object, returning adjusted
 moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');
 
 moment.fn.meridiem = function(newMeridiem) {
   if (!newMeridiem) {
     return this.format('A'); // or `return this.hours() < 12 ? 'AM' : 'PM';`
   }
   if (newMeridiem.toUpperCase() === 'AM' && this.hours() >= 12) {
     this.hours(this.hours() - 12);
   } else if (newMeridiem.toUpperCase() === 'PM' && this.hours() <= 12) {
     this.hours(this.hours() + 12);
   }
   return this;
 };
 // toJSON override to match server data
 moment.fn.toJSON = function() {
   var m = this.clone().utc();
   return this.isValid() ? m.format('YYYY-MM-DD[T]HH:mm:ss[Z]') : null;
 };
 
 export default moment;
 