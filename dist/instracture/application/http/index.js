"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const usecase_1 = require("../../../usecase/usecase");
const InMemoryRepository_1 = __importDefault(require("../../repository/InMemoryRepository"));
const log_1 = require("../../../aop/log");
const usecase = new usecase_1.UseCase(new InMemoryRepository_1.default());
const app = (0, express_1.default)();
(0, express_ws_1.default)(app);
app
    .use((0, cors_1.default)())
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use(body_parser_1.default.json())
    .use((req, res, next) => { (0, log_1.debug)(req.method, req.url); next(); })
    .get('/rooms/id', function (req, res, next) {
    const { userId, roomId } = usecase.getId();
    const board = usecase.getBoard(roomId);
    res.json(Object.assign(Object.assign({}, usecase.getGameStatus(roomId)), { id: roomId, userId, board: board.getData(), turn: usecase.getTurnUserId(roomId) }));
})
    .get('/rooms/id/:id', function (req, res, next) {
    const { userId, roomId } = usecase.receiveId(Number(req.params.id));
    const board = usecase.getBoard(roomId);
    res.json(Object.assign(Object.assign({}, usecase.getGameStatus(roomId)), { id: roomId, userId, board: board.getData(), turn: usecase.getTurnUserId(roomId) }));
})
    .post('/rooms/id/:id/users/:userId', (req, res, next) => {
    const roomId = req.params.id;
    const userId = req.params.userId;
    const x = req.body.x;
    const y = req.body.y;
    usecase.putStone(Number(roomId), userId, x, y);
    res.sendStatus(200);
})
    .ws('/rooms/id/:id/', function (ws, req) {
    (0, log_1.debug)('Subscribe WebSocket', req.url);
    const roomId = req.params.id;
    usecase.setReciever(Number(roomId), (board) => {
        (0, log_1.debug)('WebSocket sends', JSON.stringify(board.getData()));
        ws.send(JSON.stringify(Object.assign(Object.assign({}, usecase.getGameStatus(roomId)), { board: board.getData(), turn: usecase.getTurnUserId(roomId) })));
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log('listen: http://locahost:' + (process.env.PORT || 3000));
});
