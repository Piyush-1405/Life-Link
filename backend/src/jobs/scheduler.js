const cron = require('node-cron');
const logger = require('../utils/logger');
const { checkInventoryExpiry } = require('./inventoryExpiry.job');
const { checkReservationTimeout } = require('./reservationTimeout.job');

let scheduledJobs = [];

/**
 * Initializes and starts all periodic background jobs using node-cron.
 * Schedules:
 *  - checkInventoryExpiry: Runs every hour ('0 * * * *')
 *  - checkReservationTimeout: Runs every 30 minutes ('*\/30 * * * *')
 */
function startScheduler() {
  logger.info('[Scheduler] Starting background job scheduler...');

  // 1. Inventory Expiry: Run every hour at minute 0
  const inventoryExpiryJob = cron.schedule(
    '0 * * * *',
    async () => {
      logger.info('[Scheduler] Running task: checkInventoryExpiry');
      try {
        await checkInventoryExpiry();
      } catch (error) {
        logger.error(`[Scheduler] checkInventoryExpiry failed: ${error.message}`, { error });
      }
    },
    {
      scheduled: true,
      timezone: 'UTC',
    }
  );

  // 2. Reservation Timeout: Run every 30 minutes
  const reservationTimeoutJob = cron.schedule(
    '*/30 * * * *',
    async () => {
      logger.info('[Scheduler] Running task: checkReservationTimeout');
      try {
        await checkReservationTimeout();
      } catch (error) {
        logger.error(`[Scheduler] checkReservationTimeout failed: ${error.message}`, { error });
      }
    },
    {
      scheduled: true,
      timezone: 'UTC',
    }
  );

  scheduledJobs.push(
    { name: 'checkInventoryExpiry', cronExpression: '0 * * * *', job: inventoryExpiryJob },
    { name: 'checkReservationTimeout', cronExpression: '*/30 * * * *', job: reservationTimeoutJob }
  );

  logger.info('[Scheduler] LifeLink scheduled background jobs initialized successfully:');
  logger.info('  - checkInventoryExpiry: every hour (0 * * * *)');
  logger.info('  - checkReservationTimeout: every 30 minutes (*/30 * * * *)');

  return scheduledJobs;
}

/**
 * Stops all scheduled background jobs gracefully
 */
function stopScheduler() {
  if (scheduledJobs.length > 0) {
    scheduledJobs.forEach(({ name, job }) => {
      job.stop();
      logger.info(`[Scheduler] Stopped task: ${name}`);
    });
    scheduledJobs = [];
  }
}

module.exports = {
  startScheduler,
  stopScheduler,
};
