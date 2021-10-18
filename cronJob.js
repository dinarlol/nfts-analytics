/* eslint-disable no-unused-vars */
const { CronJob } = require('cron');
const api = require('./apiTest');
const fetch = require('./apiFetch');

const job = new CronJob(
  '0 */45 * * * *',
  function () {
    // do something
    api.runUpdate(0, 300);
  },
  function () {
    fetch.getMints();
    /* This function is executed when the job stops */
  },
  true /* Start the job right now */
  // timeZone /* Time zone of this job. */
);
