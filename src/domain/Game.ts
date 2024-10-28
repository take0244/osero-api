import { Board } from "./Borad";
import { IPlayer } from "./model/IPlayer";
import { StoneStatus } from "./model/StoneStats";
import { switchTurn, Turn } from "./model/Turn";

export class Game {
    board: Board;
    p1: IPlayer;
    p2: IPlayer;
    turn: Turn = Turn.ONE;

    public constructor(p1: IPlayer, p2: IPlayer) {
        this.p1 = p1;
        this.p2 = p2;
        this.board = new Board();
    }

    public play(x: number, y: number) {
        if (this.turn === Turn.ONE) {
            if (this.p1.put(this.board, x, y) 
                && this.board.isPuttable(this.p2.getMyStone())) this.turn = switchTurn(this.turn);
        } else {
            if (this.p2.put(this.board, x, y)
                && this.board.isPuttable(this.p1.getMyStone())) this.turn = switchTurn(this.turn);
        }
    }
    
    public isEnd(): boolean {
        return this.board.isEnd();
    }
    public countStones(): Record<StoneStatus, number>  {
        return this.board.count();
    }
    public isPutable(stone: StoneStatus): boolean {
        return this.board.isPuttable(stone);
    }

    public getTurn(): Turn {
        return this.turn;
    }

    public getBoard(): Board {
        return this.board;
    }
}