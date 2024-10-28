"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCase = void 0;
const log_1 = require("../aop/log");
const Game_1 = require("../domain/Game");
const Human_1 = require("../domain/Human");
const StoneStats_1 = require("../domain/model/StoneStats");
const Turn_1 = require("../domain/model/Turn");
const errors_1 = require("./errors");
class UseCase {
    constructor(repository) {
        this.repository = repository;
    }
    getId() {
        const roomId = this.repository.getLastRoomId() + 1;
        const userId = `${roomId}-${Date.now() / 2}`;
        const p1 = new Human_1.Human(StoneStats_1.StoneStatus.BLACK);
        const p2 = new Human_1.Human(StoneStats_1.StoneStatus.WHITE);
        const game = new Game_1.Game(p1, p2);
        this.repository.storeGame(`${roomId}`, { game, userTurn: { [userId]: Turn_1.Turn.ONE } });
        (0, log_1.debug)(`Enter 1nd Player: ${roomId}`);
        return { userId, roomId };
    }
    shareId() {
        // NONE
    }
    receiveId(roomId) {
        (0, log_1.debug)(`Enter 2nd Player: ${roomId}`);
        const userId = `${roomId}-${Date.now() / 2}`;
        const game = this.repository.getGame(`${roomId}`);
        if (Object.keys(game.userTurn).length >= 2)
            throw new errors_1.NoVacancyError();
        this.repository.storeGame(`${roomId}`, Object.assign(Object.assign({}, game), { userTurn: Object.assign(Object.assign({}, game.userTurn), { [userId]: Turn_1.Turn.TWO }) }));
        return { userId, roomId };
    }
    putStone(roomId, userId, x, y) {
        (0, log_1.debug)(`Put Stone RoomId: ${roomId}, UserId: ${userId}, x: ${x}, y: ${y}`);
        const { game, onChange, userTurn } = this.repository.getGame(`${roomId}`);
        if (game.getTurn() == userTurn[userId]) {
            game.play(x, y);
            if (onChange === null || onChange === void 0 ? void 0 : onChange.length)
                onChange.forEach((handler) => handler(game.getBoard()));
        }
        return game.board;
    }
    getBoard(roomId) {
        (0, log_1.debug)(`Get Board: ${roomId}`);
        return this.repository.getGame(`${roomId}`).game.getBoard();
    }
    reset(roomId) {
        const { game } = this.repository.getGame(`${roomId}`);
        const board = game.getBoard();
        board.reset();
    }
    setReciever(roomId, onChange) {
        const game = this.repository.getGame(`${roomId}`);
        this.repository.storeGame(`${roomId}`, Object.assign(Object.assign({}, game), { onChange: [...game.onChange || [], onChange] }));
    }
    getTurnUserId(roomId) {
        const { game, userTurn } = this.repository.getGame(`${roomId}`);
        const found = Object.entries(userTurn).find(([_, turn]) => turn === game.getTurn());
        return (found === null || found === void 0 ? void 0 : found.length) ? found[0] : undefined;
    }
    getGameStatus(roomId) {
        const gameInfo = this.repository.getGame(`${roomId}`);
        const color = gameInfo.game.countStones();
        const black = Object.entries(gameInfo.userTurn).find(([userId, turn]) => turn === Turn_1.Turn.ONE);
        const white = Object.entries(gameInfo.userTurn).find(([userId, turn]) => turn === Turn_1.Turn.TWO);
        return {
            isEnd: gameInfo.game.isEnd(),
            black: color[StoneStats_1.StoneStatus.BLACK],
            white: color[StoneStats_1.StoneStatus.WHITE],
            blackPlayer: black && black[0],
            whitePlayer: white && white[0],
        };
    }
    surrender() {
    }
    endGame() {
    }
}
exports.UseCase = UseCase;
