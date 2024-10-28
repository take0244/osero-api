"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
const debug = (...args) => {
    if (process.env.LOG_LEVEL === 'debug') {
        console.log('[DEBUG]:', ...args);
    }
};
exports.debug = debug;
