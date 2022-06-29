const {
    Logger,
} = require('./logger');

Logger.info('INFO', {
    message: 'world',
    moreData: 'here more data',
}, 'TAG1');

Logger.error('ERROR', {
    message: 'world',
    moreData: 'here more data',
}, 'TAG2');

Logger.debug('DEBUGGING...', {
    message: 'world',
    moreData: 'here more data',
}, 'TAG4');