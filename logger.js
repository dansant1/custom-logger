require('newrelic');
const newrelicFormatter = require('@newrelic/winston-enricher');
const winston = require('winston');
const newrelicWinstonFormatter = newrelicFormatter(winston)
const { 
    createLogger, 
    transports 
} = winston;

const logLevel = 'info'
const winstonLogger = createLogger({
    level: logLevel,
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    handleExceptions: true,
    format: newrelicWinstonFormatter(),
    transports: [
        new transports.Console()
    ],
});

const getMeta = (
    application, 
    sessionId, data = null, 
    tag = null
) => {
    let meta;
    if (data) {
        meta = {
            data: {
                application,
                sessionId,
                ...data,
            }
        }
    } else {
        meta = {
            data: {
                application,
                sessionId,
            }
        }
    }
    if (tag) {
        meta.tag = tag;
    }
    return meta;
};

class Logger {
  constructor(application, defaultSessionId) {
    this.application = application;
    this.sessionId = defaultSessionId;
  }

  static create(application, defaultSessionId) {
      return new Logger(application, defaultSessionId);
  }

  setSessionId(newSessionId) {
    this.sessionId = newSessionId;
  }
  
  info(message, data = null, tag = null) {
    const meta = getMeta(this.application, this.sessionId, data, tag);
    winstonLogger.info(message, meta);
  }

  error(message, exception = null, tag = null) {
    const properties = Object.getOwnPropertyNames(exception);
    const data = properties.reduce((acc, key) => {
      return { ...acc, [key]: exception[key] }
    }, {});
    const meta = getMeta(this.application, this.sessionId, data, tag);
    winstonLogger.error(message, meta);
  }

  warn(message, data = null, tag = null) {
    const meta = getMeta(this.application, this.sessionId, data, tag);
    winstonLogger.warn(message, meta);
  }
  
  debug(message, data = null, tag = null) {
    const meta = getMeta(this.application, this.sessionId, data, tag);
    winstonLogger.debug(message, meta);
  }
}

module.exports = {
    Logger: Logger.create('My-app', 'EDA231'),
}