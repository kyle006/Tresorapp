import log from 'loglevel';

// Set the level based on the environment
// In development, we log everything. In production, we log warnings and errors.
if (process.env.NODE_ENV === 'production') {
    log.setLevel('warn');
} else {
    log.setLevel('trace');
}

export default log; 