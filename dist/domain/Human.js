"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Human = void 0;
class Human {
    constructor(myStone) {
        this.myStone = myStone;
    }
    put(board, x, y) {
        return board.reverse({ x, y }, this.myStone);
    }
    getMyStone() {
        return this.myStone;
    }
}
exports.Human = Human;
