import express from 'express';
import expressWs from 'express-ws';
import * as core from 'express-serve-static-core';
import bodyParser from 'body-parser';
import cors from 'cors';
import {  UseCase } from '../../../usecase/usecase';
import InMemoryRepository  from '../../repository/InMemoryRepository';
import { debug } from '../../../aop/log';

const usecase = new UseCase(new InMemoryRepository());
const app = express();
expressWs(app);

(app as core.Express & { ws? : any })
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use((req, res, next) => { debug(req.method, req.url); next(); })
  .get('/rooms/id', function(req, res, next) {
    const { userId, roomId } = usecase.getId();
    const board = usecase.getBoard(roomId);
    res.json({
      ...usecase.getGameStatus(roomId),
      id: roomId,
      userId,
      board : board.getData(),
      turn : usecase.getTurnUserId(roomId),
    });
  })
  .get('/rooms/id/:id', function(req, res, next) {
    const { userId, roomId } = usecase.receiveId(Number(req.params.id));
    const board = usecase.getBoard(roomId);
    res.json({
      ...usecase.getGameStatus(roomId),
      id: roomId,
      userId,
      board : board.getData(),
      turn  : usecase.getTurnUserId(roomId)
    });
  })
  .post('/rooms/id/:id/users/:userId', (req, res, next) => {
    const roomId = req.params.id;
    const userId = req.params.userId;
    const x = req.body.x;
    const y = req.body.y;
    usecase.putStone(Number(roomId), userId, x, y);
    res.sendStatus(200);
  })
  .ws('/rooms/id/:id/', function(ws: any, req: any) {
    debug('Subscribe WebSocket', req.url);
    const roomId = req.params.id;
    usecase.setReciever(Number(roomId), (board) => {
      debug('WebSocket sends', JSON.stringify(board.getData()));
      ws.send(JSON.stringify({
        ...usecase.getGameStatus(roomId),
        board : board.getData(),
        turn  : usecase.getTurnUserId(roomId),
      }));
    });
  });


app.listen(process.env.PORT || 3000, () => {
  console.log('listen: http://locahost:'+(process.env.PORT || 3000))
});
