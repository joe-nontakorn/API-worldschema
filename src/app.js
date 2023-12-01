const loaders = require('./loaders')
const logger = require('./utils/logger')
// const cron = require('./services/cronjobService')
const express = require('express')
const app = express();


// Handling Uncaught Exception
process.on('uncaughtException', err => {
    logger.error(`ERROR: ${err.message}`);
    logger.error('Shutting down due to uncaught exception.')
    process.exit(1);
});

// Initial app loaders
loaders.init({ app: app });

// Schedule tasks to be run on the server.
// cron.cronjob()

// Start the application
const server = app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    logger.error(`Error: ${err.message}`);
    logger.error('Shutting down the server due to Unhandled promise rejection.')
    server.close(() => {
        process.exit(1);
    })
});