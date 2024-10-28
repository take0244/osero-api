import { Board } from "./Borad";
import { IPlayer } from "./model/IPlayer";
import { StoneStatus } from "./model/StoneStats";

export class Human implements IPlayer {
    private myStone: StoneStatus;
    public constructor(myStone: StoneStatus) {
        this.myStone = myStone;

    }
    put(board: Board, x: number, y: number): boolean{
        return board.reverse({ x, y }, this.myStone);
    }
    getMyStone(): StoneStatus {
        return this.myStone;
    }
}