const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.addLocale(en);

module.exports = {
    timeAgo: new TimeAgo('en-US'),
    UTC: 0,
}