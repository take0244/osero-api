export const debug = (...args: any) => {
    if (process.env.LOG_LEVEL === 'debug') {
        console.log('[DEBUG]:', ...args);
    }
};