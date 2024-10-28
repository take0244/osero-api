"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRepository = void 0;
class InMemoryRepository {
    constructor() {
        this.game = null;
        this.cache = {};
    }
    storeGame(key, arg) {
        this.cache[key] = arg;
    }
    getGame(key) {
        return this.cache[key];
    }
    getLastRoomId() {
        return Object.keys(this.cache).length;
    }
}
exports.InMemoryRepository = InMemoryRepository;
exports.default = InMemoryRepository;
