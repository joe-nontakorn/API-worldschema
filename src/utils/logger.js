const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

require('winston-daily-rotate-file');

const logDir = 'src/logs';
const datePatternConfiguration = {
    default: 'YYYY-MM-DD',
    everHour: 'YYYY-MM-DD-HH',
    everMinute: 'YYYY-MM-DD-THH-mm',
};
const numberOfDaysToKeepLog = 30;
const fileSizeToRotate = 10; // in megabyte

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%.log`,
    datePattern: datePatternConfiguration.everHour,
    zippedArchive: true,
    maxSize: `${fileSizeToRotate}m`,
    maxFiles: `${numberOfDaysToKeepLog}d`
});

const datadogTransport = new transports.Http({
    host: 'http-intake.logs.datadoghq.com',
    path: '/api/v2/logs?dd-api-key=' + process.env.DATADOG_API_KEY
        + '&host=' + process.env.DATADOG_HOST
        + '&ddsource=' + process.env.NODE_ENV
        + '&service=' + process.env.DATADOG_SERVICE,
    ssl: true
});

// const mongodbTransport = new transports.MongoDB({
//     levels: ['error', 'info'],
//     db: process.env.DATABASE_URI,
//     options: {
//         useUnifiedTopology: true,
//     },
//     collection: 'logs',
//     format: format.combine(format.timestamp(), format.json())
// });


const logger = createLogger({
    level: 'info',
    handleExceptions: true,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`),
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
        // new transports.File({ filename: 'logs/combined.log' }),
        dailyRotateFileTransport,
        // mongodbTransport,
        // datadogTransport,
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.colorize(),
            format.printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`),
        ),
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }));
}

logger.stream = {
    write: (message) => {
        logger.info(message);
    },
};

module.exports = logger;