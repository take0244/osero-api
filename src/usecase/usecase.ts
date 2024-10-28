import { debug } from "../aop/log";
import { Board } from "../domain/Borad";
import { Game } from "../domain/Game";
import { Human } from "../domain/Human";
import { StoneStatus } from "../domain/model/StoneStats";
import { Turn } from "../domain/model/Turn";
import { NoVacancyError } from "./errors";

export interface Repository {
  storeGame: (key: string, value: { game: Game, onChange?: Array<(board: Board) => void>, userTurn: Record<string, Turn> }) => void;
  getGame: (key: string) => { game: Game, onChange?: Array<(board: Board) => void>, userTurn: Record<string, Turn> };
  getLastRoomId: () => number;
}
export interface Reciever {
  recieve(roomId: number, board: Board): void;
}

export class UseCase {
    private repository: Repository;
    public constructor(repository: Repository) {
      this.repository = repository;
    }

    getId(): { userId: string, roomId: number } {
      const roomId = this.repository.getLastRoomId()+1;
      const userId = `${roomId}-${Date.now()/2}`;
      const p1 = new Human(StoneStatus.BLACK);
      const p2 = new Human(StoneStatus.WHITE);
      const game =  new Game(p1, p2);
      this.repository.storeGame(`${roomId}`, { game, userTurn: { [userId]: Turn.ONE } });

      debug(`Enter 1nd Player: ${roomId}`);
      return { userId, roomId };
    }

    shareId() {
      // NONE
    }

    receiveId(roomId: number) {
      debug(`Enter 2nd Player: ${roomId}`);
      const userId = `${roomId}-${Date.now()/2}`;
      const game = this.repository.getGame(`${roomId}`);
      
      if (Object.keys(game.userTurn).length >= 2) throw new NoVacancyError();

      this.repository.storeGame(`${roomId}`, {
        ...game,
        userTurn : {
          ...game.userTurn,
          [userId] : Turn.TWO,
        },
      })
      return { userId, roomId };
    }

    putStone(roomId: number, userId: string, x: number, y: number): Board {
        debug(`Put Stone RoomId: ${roomId}, UserId: ${userId}, x: ${x}, y: ${y}`);
        
        const { game, onChange, userTurn } = this.repository.getGame(`${roomId}`);
        if (game.getTurn() == userTurn[userId]) {
          game.play(x, y);
          if (onChange?.length) onChange.forEach((handler) => handler(game.getBoard()));
        }
        return game.board;
    }

    getBoard(roomId: number): Board {
      debug(`Get Board: ${roomId}`);
      return this.repository.getGame(`${roomId}`).game.getBoard();
    }

    reset(roomId: number) {
        const { game } = this.repository.getGame(`${roomId}`);
        const board = game.getBoard();
        board.reset();
    }

    setReciever(roomId: number, onChange: (board: Board) => void) {
      const game = this.repository.getGame(`${roomId}`);
      this.repository.storeGame(`${roomId}`, { ...game, onChange: [...game.onChange || [], onChange] });
    }

    getTurnUserId(roomId: number): string | undefined {
      const { game, userTurn } = this.repository.getGame(`${roomId}`);
      const found = Object.entries(userTurn).find(([_, turn]) => turn === game.getTurn());
      return found?.length ? found[0] : undefined;
    }

    getGameStatus(roomId: number) {
      const gameInfo = this.repository.getGame(`${roomId}`);
      const color = gameInfo.game.countStones();
      const black = Object.entries(gameInfo.userTurn).find(([userId, turn]) => turn === Turn.ONE);
      const white = Object.entries(gameInfo.userTurn).find(([userId, turn]) => turn === Turn.TWO);
      return {
        isEnd       : gameInfo.game.isEnd(),
        black       : color[StoneStatus.BLACK],
        white       : color[StoneStatus.WHITE],
        blackPlayer : black && black[0],
        whitePlayer : white && white[0],
      };
    }
    surrender() {

    }

    endGame() {

    }
}