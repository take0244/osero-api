"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Borad_1 = require("./Borad");
const Turn_1 = require("./model/Turn");
class Game {
    constructor(p1, p2) {
        this.turn = Turn_1.Turn.ONE;
        this.p1 = p1;
        this.p2 = p2;
        this.board = new Borad_1.Board();
    }
    play(x, y) {
        if (this.turn === Turn_1.Turn.ONE) {
            if (this.p1.put(this.board, x, y)
                && this.board.isPuttable(this.p2.getMyStone()))
                this.turn = (0, Turn_1.switchTurn)(this.turn);
        }
        else {
            if (this.p2.put(this.board, x, y)
                && this.board.isPuttable(this.p1.getMyStone()))
                this.turn = (0, Turn_1.switchTurn)(this.turn);
        }
    }
    isEnd() {
        return this.board.isEnd();
    }
    countStones() {
        return this.board.count();
    }
    isPutable(stone) {
        return this.board.isPuttable(stone);
    }
    getTurn() {
        return this.turn;
    }
    getBoard() {
        return this.board;
    }
}
exports.Game = Game;
