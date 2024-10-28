import { throws } from "assert";
import { StoneStatus } from "./model/StoneStats";

export type Point = {
    x: number,
    y: number,
}

export class Board {
    private stoneMap: StoneStatus[][] = [];
    private size = 8;
    
    public constructor() {
        this.reset();
    }

    reset(): void {
        for (let i = 0; i < this.size; i++) {
            this.stoneMap.push([]);
            for (let j = 0; j < this.size; j++) {
                this.stoneMap[i].push(StoneStatus.NONE);
            }
        }

        this.stoneMap[3][3] = StoneStatus.WHITE;
        this.stoneMap[4][4] = StoneStatus.WHITE;
        
        this.stoneMap[4][3] = StoneStatus.BLACK;
        this.stoneMap[3][4] = StoneStatus.BLACK;
    }

    reverse(point: Point, stone: StoneStatus, tryFlag=false): boolean {
        let result = false;
        const { x, y } = point;
        if (this.stoneMap[x][y] !== StoneStatus.NONE) return false;
        if (x >= this.size || y >= this.size || y < 0 || x < 0) throw new Error(`outside board x: ${x} y: ${y}`);
        const rev = (p: Point, next: (point: Point) => Point,  stones: Point[] = []): void => {
            const [pastX, pastY] = [point.x, point.y];
            const { x, y } = p;
            const isNext = stones.length === 1;
            const isStart = x === pastX && y === pastY;
            if (
                (x >= this.size || y >= this.size || y < 0 || x < 0)
                || (!isStart && this.stoneMap[x][y] === StoneStatus.NONE)
                || (isNext && (this.stoneMap[x][y] === stone || this.stoneMap[x][y] === StoneStatus.NONE))
            ) {
                return;
            }
            
            if (this.stoneMap[x][y] == stone && stones.length > 1) {
                result = true;
                if (!tryFlag) stones.forEach(({x, y}) => this.stoneMap[x][y] = stone);
                return;
            }

            stones.push(p);
            rev(next(p), next, stones);
        };

        const N  = (point: Point) => ({ x: point.x, y: point.y-1});
        const W  = (point: Point) => ({ x: point.x+1, y: point.y});
        const E  = (point: Point) => ({ x: point.x-1, y: point.y});
        const S  = (point: Point) => ({ x: point.x, y: point.y+1});
        const NW = (point: Point) => ({ x: point.x+1, y: point.y-1});
        const NE = (point: Point) => ({ x: point.x-1, y: point.y-1});
        const SW = (point: Point) => ({ x: point.x+1, y: point.y+1});
        const SE = (point: Point) => ({ x: point.x-1, y: point.y+1});

        [N, W, E, S, NW, NE, SW, SE].forEach((func) => rev(point, func));
        return result;
    }

    getSquare(point: Point): StoneStatus {
        const { x, y } = point;
        return this.stoneMap[x][y];
    }

    isPuttable(stone: StoneStatus): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.stoneMap[i][j] !== StoneStatus.NONE) continue;
                if (this.reverse({ x: i, y: j, }, stone, true)) return true;
             }
        }
        return false;
    }

    getData(): StoneStatus[][] {
        return this.stoneMap;
    }

    isEnd(): boolean {
        return this.count()[StoneStatus.NONE] === 0 || this.count()[StoneStatus.BLACK] === 0 || this.count()[StoneStatus.WHITE] === 0;
    }

    count(): Record<StoneStatus, number> {
        const result = {[StoneStatus.BLACK]: 0, [StoneStatus.WHITE]: 0, [StoneStatus.NONE]: 0};
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                result[this.stoneMap[i][j]] += 1;
            }
        }
        return result;
    }
    public toString(): string {
        let result = "";
        for (let y = 0; y < this.size; y++) {
            result += '|'
            for (let x = 0; x < this.size; x++) {
                result += this.stoneMap[x][y]+ '|'
            }
            result += "\n";
        }
        return result;
    }
}
